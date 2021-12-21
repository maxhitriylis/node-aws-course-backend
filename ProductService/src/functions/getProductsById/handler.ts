import type { APIGatewayProxyEventGet } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productList from '../../mocks/productList.json';

const getProductsById: APIGatewayProxyEventGet = async (event) => {
  const { id } = event.pathParameters;
  
  const product = productList.find(product => product.id === id);

  if (!product) {
    return formatJSONResponse({
      message: `No product found with this id: ${id}`,
    }, 404);
  }
  
  return formatJSONResponse({
    product,
  });
}

export const main = middyfy(getProductsById);
