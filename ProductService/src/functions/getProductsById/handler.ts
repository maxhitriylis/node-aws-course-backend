import type { APIGatewayProxyEventGet } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { Client } from "pg";
import { middyfy } from "@libs/lambda";
import { DBOptions } from "@functions/DBOptions";

const getProductsById: APIGatewayProxyEventGet = async (event) => {
  console.log("Event", event);

  const { id } = event.pathParameters;

  const client = new Client(DBOptions);

  try {
    await client.connect();
    const { rows: product } = await client.query(
      "SELECT products.id, products.title, products.description, products.img, products.price, stocks.count FROM products JOIN stocks ON products.id = stocks.product_id WHERE products.id = $1",
      [id]
    );

    if (!product.length) {
      return formatJSONResponse(
        {
          message: `No product found with this id: ${id}`,
        },
        404
      );
    }

    return formatJSONResponse({
      product,
    });
  } catch (error) {
    return formatJSONResponse(
      {
        message: error.message,
      },
      500
    );
  }

};

export const main = middyfy(getProductsById);
