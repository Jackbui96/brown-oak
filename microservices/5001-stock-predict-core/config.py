import os
import boto3
from tempfile import NamedTemporaryFile
from google.cloud import bigquery

def get_google_credentials():
    ssm = boto3.client("ssm", region_name="us-west-1")
    param = ssm.get_parameter(Name="/microservices/keys/google/GOOGLE_BIG_QUERY", WithDecryption=True)
    key_json = param['Parameter']['Value']

    temp_file = NamedTemporaryFile(delete=False, mode="w", suffix=".json")
    temp_file.write(key_json)
    temp_file.close()
    return temp_file.name

# Set credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = get_google_credentials()
client = bigquery.Client(project="bigquery-457300")
