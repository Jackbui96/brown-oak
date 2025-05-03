from datetime import datetime, timedelta
import grpc
from concurrent import futures
from tensorflow.keras.models import load_model
import stock_predict_pb2
import stock_predict_pb2_grpc
from prediction_logic import fetch_stock_data, prepare_data, predict_full_sequence, predict_next_day

class StockPredictor(stock_predict_pb2_grpc.StockPredictServiceServicer):
    def Predict(self, request, context):
        print(f"Received prediction request for: {request.symbol}")

        df = fetch_stock_data(request.symbol)
        if df.empty or len(df) < 100:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details("Not enough stock data to predict.")
            return stock_predict_pb2.PredictResponse()

        try:
            model = load_model(request.file_location)
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Failed to load model: {str(e)}")
            return stock_predict_pb2.PredictResponse()

        X, y_actual, scaler = prepare_data(df)
        predictions_history = predict_full_sequence(model, X, scaler).flatten().tolist()
        actual_prices = y_actual.flatten().tolist()

        base_date = df['TIMESTAMP'].iloc[-len(actual_prices):].reset_index(drop=True)
        predictions = []

        for i, price in enumerate(predictions_history):
            pred_date = base_date[i].strftime("%Y-%m-%d")
            actual = actual_prices[i]

            predictions.append(stock_predict_pb2.Prediction(
                date=pred_date,
                predicted_price=float(price),
                actual_price=float(actual)
            ))

        next_day_prediction = predict_next_day(request.symbol, model, scaler, df)
        future_date = (base_date.iloc[-1] + timedelta(days=1)).strftime("%Y-%m-%d")
        predictions.append(stock_predict_pb2.Prediction(
            date=future_date,
            predicted_price=float(next_day_prediction),
            actual_price=0.0  # unknown future
        ))

        return stock_predict_pb2.PredictResponse(
            symbol=request.symbol,
            predictions=predictions,
            summary=f"{request.symbol} predictions vs actual for {len(predictions)} days"
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    stock_predict_pb2_grpc.add_StockPredictServiceServicer_to_server(StockPredictor(), server)
    server.add_insecure_port("[::]:5001")
    server.start()
    print("Stock prediction service running on port 5001...")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
