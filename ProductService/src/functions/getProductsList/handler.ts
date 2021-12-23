import type { APIGatewayProxyEventGet } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productList from '../../mocks/productList.json';

const getProductsList: APIGatewayProxyEventGet = async () => {
  return formatJSONResponse({
    products: productList,
  });
}

export const main = middyfy(getProductsList);
