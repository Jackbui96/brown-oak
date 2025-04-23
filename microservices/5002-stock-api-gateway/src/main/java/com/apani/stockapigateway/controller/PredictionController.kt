package com.apani.stockapigateway.controller

import com.apani.stockapigateway.service.PredictionService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/v1/stocks")
class PredictionController(
    private val predictionService: PredictionService
) {

    private val SOI = arrayOf("TSLA", "COST", "MSFT", "AAPL", "NVDA", "PFE", "KO", "JNJ", "TGT", "PLTR", "AMD")

    @GetMapping("/symbols")
    fun getSymbols(): ResponseEntity<Map<String, Array<String>>> {
        val response = mutableMapOf<String, Array<String>>()
        response["symbols"] = SOI
        return ResponseEntity.ok(response)
    }

    @GetMapping("/predict")
    fun getPrediction(
        @RequestParam symbol: String,
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<Map<String, Any>> {
        val response = predictionService.getPrediction(symbol, startDate, endDate)

        // Convert protobuf message to a Map for JSON serialization
        val result = mutableMapOf<String, Any>()
        result["symbol"] = response.symbol
        result["summary"] = response.summary

        // Convert predictions list
        val predictions = response.predictionsList.map { prediction ->
            mapOf(
                "date" to prediction.date,
                "actualPrice" to prediction.actualPrice,
                "predictedPrice" to prediction.predictedPrice
            )
        }
        result["predictions"] = predictions

        return ResponseEntity.ok(result)
    }
}
