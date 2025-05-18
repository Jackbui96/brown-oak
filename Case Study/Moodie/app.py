import re
import pandas as pd
from collections import Counter
from config import get_mongo_atlas_movies_collection

def explore_data():

    """
    Outline:
    1. Basic dataset statistics and overview
    2. Data quality assessment
    3. Feature analysis
    4. Distribution analysis
    5. Relationship exploration
    6. Missing data handling
    7. Exploratory visualizations
    8. Insight summary
    """

    # 1. Basic dataset statistics and overview
    # Load dataset from Mongo Atlas to dataframe
    movies_collection = get_mongo_atlas_movies_collection()

    # Get all documents as a list
    movies_data = list(movies_collection.find())
    df = pd.DataFrame(movies_data)

    # pandas config
    pd.set_option('display.max_columns', None)  # Show all columns
    pd.set_option('display.width', 1000)        # Wide display
    pd.set_option('display.max_rows', None)     # Show all rows in output

    # Dataset overview
    print("\n===== DATASET OVERVIEW =====")
    print(f"Number of records: {len(df)}")
    print(f"Number of features: {df.shape[1]}")
    print("\nFeature names:")
    print(df.columns.tolist())

    print("\n===== DATA TYPES =====")
    for col in df.columns:
        sample_value = df[col].iloc[0] if not df[col].empty else None
        python_type = type(sample_value).__name__
        print(f"{col}: type={python_type}, example={sample_value}")

    print("\n===== DESCRIPTIVE STATISTICS =====")
    stats_df = df.describe(include='all').T
    stats_df['count'] = stats_df['count'].astype(int)  # Clean up count column
    print(stats_df)

    print("\n===== MISSING VALUES =====")
    missing = df.isnull().sum()
    missing_percent = (missing / len(df)) * 100
    missing_info = pd.DataFrame({
        'Missing Values': missing,
        'Percentage': missing_percent
    })
    print(missing_info[missing_info['Missing Values'] > 0])

    print("\n===== TEXT CONTENT ANALYSIS =====")
    # title
    df['title_word_count'] = df['title'].apply(lambda title: len(str(title).split()) if pd.notnull(title) else 0)
    all_title_word = ' '.join(df['title'].dropna().astype(str))
    title_words = re.findall(r'\b\w+\b', all_title_word.lower())
    title_words_count = Counter(title_words)
    title_words_avg = df['title_word_count'].mean()

    # overview
    df['overview_word_count'] = df['overview'].apply(lambda overview: len(str(overview).split()) if pd.notnull(overview) else 0)
    df['overview_char_length'] = df['overview'].apply(lambda overview: len(str(overview)) if pd.notnull(overview) else 0)

    print(f'{df.head()}\n')
    print(f'Top 20 most common words in title: {Counter(title_words_count).most_common(20)}')
    print(f"title avg words: {title_words_avg:.2f}")
    print(f"Overview avg words: {df['overview_word_count'].mean():.2f}")
    print(f"Overview avg length: {df['overview_char_length'].mean():.2f} characters")

if __name__ == "__main__":
    explore_data()
