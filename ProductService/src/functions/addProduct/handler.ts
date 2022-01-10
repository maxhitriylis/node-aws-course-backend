import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { Client } from "pg";
import { middyfy } from "@libs/lambda";
import { DBOptions } from "@functions/DBOptions";
import schema from "./schema";

const addProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log("Event", event);

  const client = new Client(DBOptions);

  const product = event.body;

  try {
    await client.connect();
  } catch (error) {
    client.end();
    return formatJSONResponse(
      {
        message: error.message,
      },
      500
    );
  }

  try {
    await client.query("begin");

    const { rows: updatedProductsData } = await client.query(
      "INSERT INTO products(title, description, img, price) values ($1, $2, $3, $4) RETURNING *",
      [product.title, product.description, product.img, product.price]
    );

    const { rows: updatedStockData } = await client.query(
      "INSERT INTO stocks(product_id, count) values ($1, $2) RETURNING *",
      [updatedProductsData[0].id, product.count]
    );

    await client.query("commit");

    return formatJSONResponse({
      product: {
        ...updatedProductsData[0],
        count: updatedStockData[0].count,
      },
    });
  } catch (error) {
    await client.query('rollback');
    return formatJSONResponse(
      {
        message: error.message,
      },
      500
    );
  } finally {
    client.end();
  }
};

export const main = middyfy(addProduct);
