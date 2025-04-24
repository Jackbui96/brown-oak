package com.apani.stockapigateway.service.s3

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths

@Service
class S3Service (
    @Value("\${aws.bucket}") private val bucket: String,
    @Value("\${aws.modelKey}") private val modelKey: String,
    @Value("\${aws.region}") private val region: String,
    @Value("\${aws.downloadDir}") private val downloadDir: String
) {

    fun downloadModel(symbol: String): File {
        val s3Client: S3Client = S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build()

        val tempDir = System.getProperty("java.io.tmpdir")
        val fileName  = "2025-04-20/${symbol}_lstm_model.keras".substringAfterLast("/")
        val localPath = Paths.get(tempDir, fileName)

        if (Files.notExists(localPath)) {
            val request = GetObjectRequest.builder()
                .bucket(bucket)
                .key("2025-04-20/${symbol}_lstm_model.keras")
                .build()

            s3Client.getObject(request, localPath)
        }

        return localPath.toFile()
    }

}
