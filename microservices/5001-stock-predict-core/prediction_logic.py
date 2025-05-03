import numpy as np
from sklearn.preprocessing import MinMaxScaler

from config import client

def fetch_stock_data(symbol):
    query = f"""
    SELECT TIMESTAMP, CLOSE
    FROM `bigquery-457300.stock_data.stock_data`
        WHERE SYMBOL = '{symbol}'
        ORDER BY TIMESTAMP
    """
    return client.query(query).to_dataframe()

def prepare_data(df):
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[['CLOSE']])
    X = np.array([scaled[i-60:i, 0] for i in range(60, len(scaled))])
    X = X.reshape((X.shape[0], X.shape[1], 1))
    y_actual = scaler.inverse_transform(scaled[60:])
    return X, y_actual, scaler

def predict_full_sequence(model, X, scaler):
    predictions = model.predict(X)
    return scaler.inverse_transform(predictions)

def predict_next_day(symbol, model, scaler, df):
    recent_prices = df['CLOSE'].values[-60:].reshape(-1, 1)
    scaled_input = scaler.transform(recent_prices)
    X_input = scaled_input.reshape((1, 60, 1))
    predicted_scaled = model.predict(X_input)
    return float(scaler.inverse_transform(predicted_scaled)[0][0])
