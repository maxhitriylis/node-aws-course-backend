import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import csv from 'csvtojson';
import split2 from 'split2';
import { pipeline, Transform } from "stream";

let header: null | string = null;

const transformStream = new Transform({
  transform: async (chunk: Buffer, _, callback) => {
    if (!header) {
      header = chunk.toString();
      callback();
    } else {
      const line = chunk.toString();
      const fromCsvToArray = await csv().fromString(`${header}\n${line}`);
      const stringified = `${JSON.stringify(fromCsvToArray[0])}\n`;
      console.log('File line: ', stringified);
      callback(null, stringified);
    }
  },
});

const parseFileLineByLine = (fileObject: GetObjectCommandOutput) => {
  pipeline(fileObject.Body, split2(), transformStream, (error) => {
    if (error) {
      console.log('Error while reading while: ', error);
    } else {
      console.log('File parsing completed');
    }
  });
}

export { parseFileLineByLine };