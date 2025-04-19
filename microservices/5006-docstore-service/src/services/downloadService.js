import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-west-1" });

const getPublicResumeUrl = async () => {
    const command = new GetObjectCommand({
        Bucket: "nb-portfolio-public-assets",
        Key: "Nguyen_Bui_Resume.pdf",
        ResponseContentDisposition: "attachment; filename=Nguyen_Bui_Resume.pdf",
    });

    // 1 min expiry
    return await getSignedUrl(s3, command, {expiresIn: 60});
}

export {
    getPublicResumeUrl,
}
