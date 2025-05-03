package com.apani.stockapigateway.service.s3

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.S3Exception
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.text.SimpleDateFormat
import java.util.*

@Service
class S3Service (
    @Value("\${aws.bucket}") private val bucket: String,
    @Value("\${aws.region}") private val region: String,
    @Value("\${aws.downloadDir}") private val downloadDir: String
) {
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd")

    fun downloadModel(symbol: String): File {
        val s3Client: S3Client = S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build()

        var modelFile: File? = null
        for (offset in 0..2) { // Past 3 days (today, yesterday, 2 days ago)
            val calendar = Calendar.getInstance()
            calendar.add(Calendar.DATE, -offset)
            val dateStr = dateFormat.format(calendar.time)
            val s3Key = "$dateStr/${symbol}_lstm_model.keras"
            val fileName = s3Key.substringAfterLast("/")
            val localPath = Paths.get(downloadDir, fileName)

            if (Files.notExists(localPath)) {
                val request = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(s3Key)
                    .build()

                try {
                    println("📦 Attempting to download $s3Key from S3...")
                    s3Client.getObject(request, localPath)
                    modelFile = localPath.toFile()
                    println("✅ Downloaded $s3Key successfully.")
                    break
                } catch (e: S3Exception) {
                    println("⚠️ $s3Key not found in S3: ${e.message}")
                }
            } else {
                modelFile = localPath.toFile()
                println("📂 Model already exists locally at $localPath.")
                break
            }
        }

        return modelFile ?: throw RuntimeException("❌ Model not found in S3 for the past 3 days.")
    }
}
