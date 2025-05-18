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
def generate_embeddings(texts):
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(texts)

    return embeddings

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

def combine_features(title_embeddings, overview_embeddings, title_weight=0.3):
    overview_weight = 1 - title_weight

    # Normalize embeddings
    title_norm = title_embeddings / np.linalg.norm(title_embeddings, axis=1).reshape(-1, 1)
    overview_norm = overview_embeddings / np.linalg.norm(overview_embeddings, axis=1).reshape(-1, 1)

    # Weighted combination
    combined = (title_weight * title_norm) + (overview_weight * overview_norm)

    return combined
