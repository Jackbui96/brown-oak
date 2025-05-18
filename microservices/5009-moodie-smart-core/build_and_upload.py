import os
import json
import numpy as np
import pandas as pd
import boto3
import h5py
from datetime import datetime
import argparse
import zipfile
import tempfile
import logging
from config import get_mongo_atlas_collection
from preprocess import preprocess_text, generate_title_embeddings, generate_overview_embeddings, combine_features

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def save_embeddings_to_h5(file_path, title_embeddings, overview_embeddings, combined_embeddings, metadata):
    """Save all embeddings to a single HDF5 file with compression and metadata"""
    logger.info(f"Saving embeddings to HDF5 file: {file_path}")

    with h5py.File(file_path, 'w') as f:
        # Create embeddings groups
        embeddings_group = f.create_group("embeddings")

        # Save embeddings with compression
        embeddings_group.create_dataset(
            "title_embeddings",
            data=title_embeddings,
            compression="gzip",
            compression_opts=9
        )

        embeddings_group.create_dataset(
            "overview_embeddings",
            data=overview_embeddings,
            compression="gzip",
            compression_opts=9
        )

        embeddings_group.create_dataset(
            "combined_embeddings",
            data=combined_embeddings,
            compression="gzip",
            compression_opts=9
        )

        # Create metadata group
        meta_group = f.create_group("metadata")

        # Save scalar metadata as attributes
        for key, value in metadata.items():
            if isinstance(value, (str, int, float, bool)) or value is None:
                meta_group.attrs[key] = value

        # Save non-scalar metadata as datasets
        for key, value in metadata.items():
            if isinstance(value, (list, tuple)) or (isinstance(value, np.ndarray) and value.size > 1):
                meta_group.create_dataset(key, data=np.array(value))
            elif isinstance(value, dict):
                # Convert dict to JSON string
                meta_group.attrs[key] = json.dumps(value)

    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    logger.info(f"HDF5 file created successfully. Size: {file_size_mb:.2f} MB")
    return file_path

def upload_to_s3(bucket_name, local_file_path, s3_key):
    """Upload a file to S3"""
    s3_client = boto3.client('s3')
    logger.info(f"Uploading {local_file_path} to s3://{bucket_name}/{s3_key}")
    s3_client.upload_file(local_file_path, bucket_name, s3_key)
    return f"s3://{bucket_name}/{s3_key}"

def package_model_artifacts(model_data, output_dir, version=None):
    """Package model artifacts for upload using HDF5 format"""
    if version is None:
        version = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Create directory for this version
    version_dir = os.path.join(output_dir, version)
    os.makedirs(version_dir, exist_ok=True)

    # Prepare metadata
    metadata = {
        "version": version,
        "created_at": datetime.now().isoformat(),
        "title_embedding_shape": model_data["title_embeddings"].shape,
        "overview_embedding_shape": model_data["overview_embeddings"].shape,
        "combined_embedding_shape": model_data["combined_embeddings"].shape,
        "num_movies": len(model_data["df"]),
        "title_weight": model_data.get("title_weight", 0.3),
        "overview_weight": model_data.get("overview_weight", 0.7),
        "embedding_model": model_data.get("embedding_model", "all-MiniLM-L6-v2"),
        "movie_ids": model_data["df"]["tmdbId"].tolist()
    }

    # Save all embeddings to a single HDF5 file
    h5_file_path = os.path.join(version_dir, "embeddings.h5")
    save_embeddings_to_h5(
        h5_file_path,
        model_data["title_embeddings"],
        model_data["overview_embeddings"],
        model_data["combined_embeddings"],
        metadata
    )

    # Save movie data
    model_data["df"].to_csv(os.path.join(version_dir, "movies.csv"), index=False)

    # Save metadata as a separate JSON file for easy access
    with open(os.path.join(version_dir, "metadata.json"), 'w') as f:
        json.dump(metadata, f, indent=2)

    # Create a ZIP archive
    zip_path = os.path.join(output_dir, f"movie_recommender_model_{version}.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(version_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, version_dir)
                zipf.write(file_path, arcname)

    logger.info(f"Model artifacts packaged to {zip_path}")
    return zip_path, metadata

def build_and_upload_model(
        database, database_collection, bucket_name,
        model_prefix="models", embedding_model="all-MiniLM-L6-v2",
        title_weight=0.3, overview_weight=0.7
):
    """Build model locally and upload to S3"""
    # Connecting and retrieving collection from Mongo Atlas
    try:
        collection = get_mongo_atlas_collection(database, database_collection)
    except ValueError as e:
        logger.error(f"Error: {str(e)}")
        return
    except Exception as e:
        # Handle other errors
        logger.error(f"Error connecting to MongoDB: {str(e)}")
        return

    # Load movie data
    logger.info(f"Loading movie data from {database}:{database_collection}")
    data = list(collection.find())
    df = pd.DataFrame(data)

    logger.info("\n===== DESCRIPTIVE STATISTICS =====")
    df['clean_title'] = df['title'].apply(preprocess_text)
    df['clean_overview'] = df['overview'].apply(preprocess_text)
    logger.info(df.head())

    # Generate embeddings
    logger.info(f"Start title embeddings....")
    title_embeddings = generate_title_embeddings(df, model_name=embedding_model)
    logger.info(f"Start overview embeddings....")
    overview_embeddings = generate_overview_embeddings(df, model_name=embedding_model)
    logger.info(f"Combining features....")
    combined_embeddings = combine_features(
        title_embeddings, overview_embeddings,
        title_weight=title_weight,
        overview_weight=overview_weight
    )

    # Package model artifacts
    version = datetime.now().strftime("%Y%m%d_%H%M%S")

    model_data = {
        "title_embeddings": title_embeddings,
        "overview_embeddings": overview_embeddings,
        "combined_embeddings": combined_embeddings,
        "df": df,
        "title_weight": title_weight,
        "overview_weight": overview_weight,
        "embedding_model": embedding_model
    }

    with tempfile.TemporaryDirectory() as temp_dir:
        zip_path, metadata = package_model_artifacts(model_data, temp_dir, version=version)

        # Upload to S3
        s3_key = f"{model_prefix}/movie_recommender_model_{version}.zip"
        s3_url = upload_to_s3(bucket_name, zip_path, s3_key)

        # Upload metadata as a separate file for easy access
        metadata_file = os.path.join(temp_dir, "metadata.json")
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)

        metadata_key = f"{model_prefix}/metadata/model_metadata_{version}.json"
        upload_to_s3(bucket_name, metadata_file, metadata_key)

        # Also upload as latest.json for easy retrieval of the latest model
        latest_key = f"{model_prefix}/metadata/latest.json"
        upload_to_s3(bucket_name, metadata_file, latest_key)

    logger.info(f"Model successfully uploaded to {s3_url}")
    logger.info(f"Model metadata available at s3://{bucket_name}/{metadata_key}")

    return {
        "model_url": s3_url,
        "metadata_url": f"s3://{bucket_name}/{metadata_key}",
        "version": version
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build and upload movie recommendation model to S3")

    parser.add_argument("--database", required=True, help="Database connection")
    parser.add_argument("--database-collection", required=True, help="Collection used for model training")
    parser.add_argument("--bucket", required=True, help="S3 bucket name")
    parser.add_argument("--model-prefix", default="models", help="S3 prefix for model files")
    parser.add_argument("--embedding-model", default="all-MiniLM-L6-v2",
                        help="SentenceTransformer model name for embeddings")
    parser.add_argument("--title-weight", type=float, default=0.3,
                        help="Weight for title embeddings (0-1)")
    parser.add_argument("--overview-weight", type=float, default=0.7,
                        help="Weight for overview embeddings (0-1)")
    parser.add_argument("--compression-level", type=int, default=9,
                        help="HDF5 compression level (0-9, higher is more compressed)")

    args = parser.parse_args()

    build_and_upload_model(
        args.database,
        args.database_collection,
        args.bucket,
        model_prefix=args.model_prefix,
        embedding_model=args.embedding_model,
        title_weight=args.title_weight,
        overview_weight=args.overview_weight
    )
