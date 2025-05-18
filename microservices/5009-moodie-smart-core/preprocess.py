import logging
import re
import nltk
import numpy as np
from nltk import WordNetLemmatizer
from nltk.corpus import stopwords
from sentence_transformers import SentenceTransformer
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer

nltk.download("stopwords")
nltk.download("wordnet")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

"""
Reduce text to its core by:
1. Lowercase text
2. Remove special characters 
3. Tokenize (split into words)
4. Remove stopwords
5. Lemmatize words (reduce to base form)

Lemmatization vs stemming examples:
"caring" → "car" (stemming) vs. "care" (lemmatization)
"worse" → "wors" (stemming) vs. "bad" (lemmatization) 
"studies" → "studi" (stemming) vs. "study" (lemmatization)
"""
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', "", text)

    tokens = text.split()

    stop_words = set(stopwords.words("english"))
    tokens = [token for token in tokens if token not in stop_words]

    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(token) for token in tokens]

    return " ".join(tokens)

"""
Embedding using Pre-trained Sentence Transformers
"""
def generate_title_embeddings(df, model_name="all-MiniLM-L6-v2"):
    """Generate embeddings for movie titles"""
    logger.info(f"Generating title embeddings using {model_name}...")
    model = SentenceTransformer(model_name)
    titles = df["clean_title"].tolist()

    #Generate in batches to avoid memory issues
    batch_size = 128
    embeddings = []

    for i in range(0, len(titles), batch_size):
        batch = titles[i: i + batch_size]
        batch_embeddings = model.encode(batch, show_progress_bar=True)
        embeddings.append(batch_embeddings)

    return np.vstack(embeddings)

def generate_overview_embeddings(df, model_name="all-MiniLM-L6-v2"):
    """Generate embeddings for movie overviews"""
    logger.info(f"Generating overview embeddings using {model_name}...")
    model = SentenceTransformer(model_name)
    overviews = df["clean_overview"].fillna("").tolist()

    #Generate in batches to avoid memory issues
    batch_size = 64
    embeddings = []

    for i in range(0, len(overviews), batch_size):
        batch = overviews[i: i + batch_size]
        batch_embeddings = model.encode(batch, show_progress_bar=True)
        embeddings.append(batch_embeddings)

    return np.vstack(embeddings)

"""
Embedding using TF-IDF + SVD
"""
def generate_tfidf_embeddings(texts, n_components=100):
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer(max_features=5000)
    tfidf_matrix = vectorizer.fit(texts)

    # Dimensionality reduction with SVD
    svd = TruncatedSVD(n_components=n_components)
    embeddings = svd.fit_transform(tfidf_matrix)

    return embeddings, vectorizer

def combine_features(title_embeddings, overview_embeddings, title_weight=0.3, overview_weight=0.7):
    """Combine title and overview embeddings with weighted importance"""
    # Ensure weights sum to 1
    total_weight = title_weight + overview_weight
    title_weight = title_weight / total_weight
    overview_weight = overview_weight / total_weight

    # Normalize embeddings
    title_norm = title_embeddings / np.linalg.norm(title_embeddings, axis=1).reshape(-1, 1)
    overview_norm = overview_embeddings / np.linalg.norm(overview_embeddings, axis=1).reshape(-1, 1)

    # Weighted combination
    combined = (title_weight * title_norm) + (overview_weight * overview_norm)

    return combined
