from datetime import datetime
from pathlib import Path
import numpy as np
import os
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from config import bigQueryClient, PROJECT_ID, DATASET_ID, TABLE_ID, get_s3_client, S3_BUCKET_NAME


def upload_model_to_s3(local_model_path, symbol):
    try:
        s3_client = get_s3_client()
        if not s3_client:
            return False

        # Get today's date for versioning
        today_str = datetime.today().strftime('%Y-%m-%d')

        # Define S3 key with date-based path: date/SYMBOL_lstm_model.keras
        s3_key = f"{today_str}/{symbol}_lstm_model.keras"

        print(f"🔼 Uploading model for {symbol} to S3...")
        s3_client.upload_file(
            str(local_model_path),
            S3_BUCKET_NAME,
            s3_key
        )
        print(f"✅ Successfully uploaded model to s3://{S3_BUCKET_NAME}/{s3_key}")
        return True
    except Exception as e:
        print(f"❌ Failed to upload model to S3: {str(e)}")
        return False

def fetch_stock_data(symbol):
    try:
        query = f"""
            SELECT TIMESTAMP, CLOSE
            FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
            WHERE SYMBOL = '{symbol}'
            ORDER BY TIMESTAMP
        """
        df = bigQueryClient.query(query).to_dataframe()
        return df
    except Exception as e:
        print(f"❌ Error fetching data for {symbol} from BigQuery: {str(e)}")
        return None

def prepare_data(data, time_step=60):
    try:
        scaler = MinMaxScaler(feature_range=(0, 1))
        data_scaled = scaler.fit_transform(data[['CLOSE']])
        X, y = [], []
        for i in range(time_step, len(data_scaled)):
            X.append(data_scaled[i - time_step:i, 0])
            y.append(data_scaled[i, 0])
        X = np.array(X)
        y = np.array(y)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        return X, y, scaler
    except Exception as e:
        print(f"❌ Error preparing data: {str(e)}")
        return None, None, None

def build_and_train_model(X_train, y_train, epochs=50, batch_size=32):
    try:
        model = Sequential()
        model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
        model.add(Dropout(0.2))
        model.add(LSTM(50))
        model.add(Dropout(0.2))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, verbose=0)
        return model
    except Exception as e:
        print(f"❌ Error building or training model: {str(e)}")
        return None

def process_symbol(symbol):
    try:
        print(f"▶️ Processing {symbol}...")

        # Fetch data
        data = fetch_stock_data(symbol)
        if data is None:
            print(f"⛔ Failed to fetch data for {symbol}. Skipping.")
            return False

        if data.empty:
            print(f"⛔ No data available for {symbol}. Skipping.")
            return False

        if len(data) < 100:
            print(f"⛔ Not enough data for {symbol} (only {len(data)} records). Need at least 100. Skipping.")
            return False

        # Prepare data
        X, y, scaler = prepare_data(data)
        if X is None or y is None:
            print(f"⛔ Failed to prepare data for {symbol}. Skipping.")
            return False

        if len(X) < 10:
            print(f"⛔ Not enough processed data points for {symbol} (only {len(X)}). Skipping.")
            return False

        # Split data
        train_size = int(0.8 * len(X))
        if train_size < 5:
            print(f"⛔ Training set too small for {symbol} (only {train_size} records). Skipping.")
            return False

        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]

        # Train model
        model = build_and_train_model(X_train, y_train)
        if model is None:
            print(f"⛔ Failed to build or train model for {symbol}. Skipping.")
            return False

        # Ensure local models directory exists (for temporary storage)
        model_dir = Path(__file__).parent.parent / "models"
        try:
            os.makedirs(model_dir, exist_ok=True)
            print(f"✅ Ensured local models directory exists at: {model_dir}")
        except Exception as e:
            print(f"❌ Failed to create local models directory: {str(e)}")
            return False

        # Save model locally first
        local_model_path = model_dir / f"{symbol}_lstm_model.keras"
        try:
            model.save(str(local_model_path))
            print(f"✅ Successfully saved model locally for {symbol} to {local_model_path}")
        except Exception as e:
            print(f"❌ Failed to save model locally for {symbol}: {str(e)}")
            return False

        # Upload to S3
        s3_upload_success = upload_model_to_s3(local_model_path, symbol)
        if not s3_upload_success:
            print(f"⚠️ Model was saved locally but failed to upload to S3 for {symbol}")
            # Continue and return True since we at least saved locally

        return True

    except Exception as e:
        print(f"❌ Unexpected error processing {symbol}: {str(e)}")
        return False
