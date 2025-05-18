import boto3
from pymongo import MongoClient

def get_mongo_atlas_connection_string():
    ssm = boto3.client("ssm", region_name="us-west-1")
    param = ssm.get_parameter(
        Name="/microservices/databases/ATLAS_URI_MOODIE",
        WithDecryption=True
    )

    return param["Parameter"]["Value"]

def get_mongo_atlas_movies_collection():
    client = MongoClient(get_mongo_atlas_connection_string())
    db = client["moodie"]

    return db["movies"]
