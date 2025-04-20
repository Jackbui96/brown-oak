import time
import os
import boto3
import atexit
from tempfile import NamedTemporaryFile
from botocore.exceptions import EndpointConnectionError, BotoCoreError, ClientError
from google.cloud import bigquery

# SSM Client
ssm = boto3.client("ssm", region_name="us-west-1")

# Cache dictionary
_ssm_cache = {}

# Store the temp file path globally to access it later
_temp_credential_file = None

def get_cached_ssm_param(name, retries=3, backoff=2):
    if name in _ssm_cache:
        return _ssm_cache[name]

    for attempt in range(1, retries + 1):
        try:
            print(f"🔑 {name} not in cache. Fetching from SSM (attempt {attempt})...")
            param = ssm.get_parameter(Name=name, WithDecryption=True)
            _ssm_cache[name] = param['Parameter']['Value']
            return _ssm_cache[name]
        except (EndpointConnectionError, ClientError, BotoCoreError) as e:
            print(f"⚠️ Error fetching {name}: {e}")
            if attempt < retries:
                sleep_time = backoff ** attempt
                print(f"⏳ Retrying in {sleep_time}s...")
                time.sleep(sleep_time)
            else:
                print(f"❌ Failed to fetch {name} after {retries} attempts.")
                raise

def config_google_credentials():
    global _temp_credential_file
    key_json = get_cached_ssm_param("/microservices/keys/google/GOOGLE_BIG_QUERY")
    temp_file = NamedTemporaryFile(delete=False, mode="w", suffix=".json")
    temp_file.write(key_json)
    temp_file.close()
    _temp_credential_file = temp_file.name
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_file.name

def config_polygon_key():
    return get_cached_ssm_param("/microservices/keys/polygon/POLYGON_KEY")

def cleanup_credentials():
    global _temp_credential_file
    if _temp_credential_file and os.path.exists(_temp_credential_file):
        try:
            os.remove(_temp_credential_file)
            print(f"Cleaned up temporary credentials file: {_temp_credential_file}")
        except Exception as e:
            print(f"Failed to clean up temporary file {_temp_credential_file}: {e}")

def get_s3_client():
    try:
        # Using boto3 client from config to leverage your existing credentials
        return boto3.client('s3')
    except Exception as e:
        print(f"❌ Error creating S3 client: {str(e)}")
        return None

config_google_credentials()
config_polygon_key()

# Config
bigQueryClient = bigquery.Client(project="bigquery-457300")
POLYGON_KEY = config_polygon_key()
SOI = ["TSLA", "COST", "MSFT", "AAPL", "NVDA", "PFE", "KO", "JNJ", "TGT", "PLTR", "AMD"]
PROJECT_ID = "bigquery-457300"
DATASET_ID = "stock_data"
TABLE_ID = "stock_data"
S3_BUCKET_NAME = "brown-oak-stock-prediction-models"

atexit.register(cleanup_credentials)
