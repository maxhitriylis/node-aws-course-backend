import type { APIGatewayProxyEventGet } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { Client } from "pg";
import { middyfy } from "@libs/lambda";
import { DBOptions } from "@functions/DBOptions";

const getProductsList: APIGatewayProxyEventGet = async (event) => {
  console.log("Event", event);

  const client = new Client(DBOptions);

  try {
    await client.connect();
    const { rows: productsList } = await client.query(
      "SELECT p.id, title, description, img, price, count FROM products p JOIN stocks s ON p.id = s.product_id"
    );

    return formatJSONResponse({
      products: productsList,
    });
  } catch (error) {
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

export const main = middyfy(getProductsList);
