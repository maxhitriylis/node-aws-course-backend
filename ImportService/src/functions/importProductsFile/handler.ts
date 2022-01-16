import { formatJSONResponse, APIGatewayProxyEventGet } from "@libs/apiGateway";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@libs/s3Client";
import { middyfy } from "@libs/lambda";

const importProductsFile: APIGatewayProxyEventGet = async (event) => {
  const {
    queryStringParameters: { name: fileName },
  } = event;

  if (!fileName) {
    return formatJSONResponse({ message: "File name not found" }, 400);
  }

  const bucketParams = {
    Bucket: "imported-files-aws-course",
    Key: `uploaded/${fileName}`,
    ContentType: "text/csv",
  };

  const putCommand = new PutObjectCommand(bucketParams);

  try {
    const signedUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 180,
    });

    return formatJSONResponse({
      url: signedUrl,
    });
  } catch (error) {
    console.log(error);

    return formatJSONResponse({
      message: error.message,
    }, 500);
  }
};

export const main = middyfy(importProductsFile);
