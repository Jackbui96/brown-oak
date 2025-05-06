import requests
import time
import pandas as pd
from datetime import datetime, timedelta
from google.cloud import bigquery
from config import POLYGON_KEY, bigQueryClient, SOI, PROJECT_ID, DATASET_ID, TABLE_ID

# Today's and yesterday's date
today = datetime.today()
yesterday = today - timedelta(days=1)
from_date = yesterday.strftime('%Y-%m-%d')
to_date = today.strftime('%Y-%m-%d')

def fetch_polygon_daily(symbol):
    print(f"Fetching {symbol} for {to_date}")
    url = (
        f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/"
        f"{from_date}/{to_date}"
        f"?adjusted=true&sort=asc&limit=1&apiKey={POLYGON_KEY}"
    )
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error fetching {symbol}: {response.text}")
        return None

    results = response.json().get("results", [])
    if not results:
        print(f"No data returned for {symbol}")
        return None

    df = pd.DataFrame(results)
    df["timestamp"] = pd.to_datetime(df["t"], unit="ms")
    df["symbol"] = symbol
    df.rename(columns={
        "o": "open",
        "h": "high",
        "l": "low",
        "c": "close",
        "v": "volume"
    }, inplace=True)

    return df[["timestamp", "symbol", "open", "high", "low", "close", "volume"]]

def insert_into_bigquery(df):
    try:
        table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
        symbol = df["symbol"].iloc[0]
        timestamp = df["timestamp"].iloc[0].strftime('%Y-%m-%d')

        # Check for existing data
        try:
            query = f"""
                SELECT COUNT(*) as count
                FROM `{table_ref}`
                WHERE symbol = @symbol
                AND DATE(timestamp) = @date
            """
            job_config = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("symbol", "STRING", symbol),
                    bigquery.ScalarQueryParameter("date", "DATE", timestamp),
                ]
            )
            query_job = bigQueryClient.query(query, job_config=job_config)
            row = list(query_job.result())[0]

            if row.count > 0:
                print(f"⚠️ Skipping {symbol} on {timestamp}: already exists in BigQuery.")
                return 0
        except Exception as e:
            print(f"⚠️ Error checking for existing data for {symbol}: {str(e)}")
            # Continue with insertion attempt even if check fails

        # Insert only if not duplicate (or if check failed)
        try:
            job = bigQueryClient.load_table_from_dataframe(
                df,
                table_ref,
                job_config=bigquery.LoadJobConfig(write_disposition="WRITE_APPEND")
            )
            job.result()  # Wait for the job to complete
            print(f"✅ Inserted {len(df)} rows for {symbol} on {timestamp} into {TABLE_ID}")
            return 1
        except Exception as e:
            print(f"❌ Failed to insert data for {symbol}: {str(e)}")
            return 0
    except Exception as e:
        print(f"❌ Unexpected error processing {df['symbol'].iloc[0] if not df.empty else 'unknown'}: {str(e)}")
        return 0

def run_daily_fetch():
    result_summary = {}

    for symbol in SOI:
        try:
            df = fetch_polygon_daily(symbol)
            if df is not None and not df.empty:
                inserted = insert_into_bigquery(df)
                result_summary[symbol] = inserted
            else:
                result_summary[symbol] = 0  # no data fetched
                print(f"⚠️ No data fetched for {symbol}")
        except Exception as e:
            print(f"❌ Error processing {symbol}: {str(e)}")
            result_summary[symbol] = 0

        time.sleep(12)  # Respect rate limit

    return result_summary
