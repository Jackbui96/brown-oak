package com.apani.stockapigateway.service

import com.apani.stockapigateway.service.s3.S3Service
import io.grpc.ManagedChannel
import io.grpc.ManagedChannelBuilder
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlinx.coroutines.runBlocking

import stockpredict.PredictRequest
import stockpredict.PredictResponse
import stockpredict.Prediction
import stockpredict.StockPredictServiceGrpcKt

@Service
class PredictionService(
    private val s3Service: S3Service,
) {

    private val channel: ManagedChannel by lazy {
        ManagedChannelBuilder
            .forAddress("localhost", 5001)
            .usePlaintext()
            .build()
    }

    private val grpcClient = StockPredictServiceGrpcKt.StockPredictServiceCoroutineStub(channel)

    fun getPrediction(symbol: String, startDate: String? = null, endDate: String? = null): PredictResponse = runBlocking {
        // Download model file from S3
        val modelFile = s3Service.downloadModel(symbol)
        println("Model file downloaded to: ${modelFile.absolutePath}")

        // Build the request with required parameters
        val requestBuilder = PredictRequest.newBuilder()
            .setSymbol(symbol)
            .setFileLocation(modelFile.absolutePath)

        val request = requestBuilder.build()

        try {
            // Call the Python prediction service via gRPC
            val response = grpcClient.predict(request)

            if (response.predictionsCount > 0) {
                println("Successfully received predictions from Python service")
                return@runBlocking response
            } else {
                println("Python service returned empty predictions, falling back to mock data")
                return@runBlocking createMockResponse(symbol)
            }
        } catch (e: Exception) {
            println("Error connecting to Python prediction service: ${e.message}")
            e.printStackTrace()

            // Fallback to mock data in case of error
            return@runBlocking createMockResponse(symbol)
        }
    }

    private fun createMockResponse(symbol: String): PredictResponse {
        val predictions = generateMockPredictions(symbol)

        return PredictResponse.newBuilder()
            .setSymbol(symbol)
            .addAllPredictions(predictions)
            .setSummary("$symbol is expected to rise by 2% next week (MOCK DATA)")
            .build()
    }

    private fun generateMockPredictions(symbol: String): List<Prediction> {
        val predictions = mutableListOf<Prediction>()
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        val startPrice = when(symbol) {
            "AAPL" -> 175.50f
            "GOOGL" -> 125.75f
            "MSFT" -> 278.50f
            else -> 100.00f
        }

        // Generate predictions for the next 5 days
        for (i in 1..5) {
            val date = LocalDate.now().plusDays(i.toLong())
            val predictedPrice = startPrice * (1 + (i * 0.005f)) // 0.5% increase per day

            val prediction = Prediction.newBuilder()
                .setDate(date.format(formatter))
                .setPredictedPrice(predictedPrice)
                .build()

            predictions.add(prediction)
        }

        return predictions
    }
}
