import boto3
from pymongo import MongoClient

def get_mongo_atlas_connection_string(app_name):
    ssm = boto3.client("ssm", region_name="us-west-1")

    app_to_connection = {
        "moodie": "/microservices/databases/ATLAS_URI_MOODIE",
    }

    if app_name not in app_to_connection:
        raise ValueError(f"Invalid app_name: '{app_name}'. Valid options are: {list(app_to_connection.keys())}")

    param = ssm.get_parameter(
        Name=app_to_connection[app_name],
        WithDecryption=True
    )

    return param["Parameter"]["Value"]

def get_mongo_atlas_collection(app_name, collection):
    client = MongoClient(get_mongo_atlas_connection_string(app_name))
    db = client[app_name]

    return db[collection]
