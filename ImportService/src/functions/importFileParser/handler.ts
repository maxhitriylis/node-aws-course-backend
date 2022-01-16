import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { parseFileLineByLine } from "@libs/csvParser";
import { middyfy } from "@libs/lambda";
import { s3Client } from "@libs/s3Client";

const importFileParser = async (event) => {
  const { Records } = event;

  try {
    for await (const record of Records) {
      const objectKey = record.s3.object.key as string;
      const parsedObjectKey = objectKey.replace("uploaded", "parsed");

      const bucketParams = {
        Bucket: "imported-files-aws-course",
        Key: objectKey,
      };

      const copyObjectParams = {
        Bucket: "imported-files-aws-course",
        CopySource: `imported-files-aws-course/${objectKey}`,
        Key: parsedObjectKey,
      };

      const getObject = new GetObjectCommand(bucketParams);
      const copyObject = new CopyObjectCommand(copyObjectParams);
      const deleteObject = new DeleteObjectCommand(bucketParams);

      const object = await s3Client.send(getObject);

      console.log(object);
      parseFileLineByLine(object);

      await s3Client.send(copyObject);
      await s3Client.send(deleteObject);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const main = middyfy(importFileParser);
