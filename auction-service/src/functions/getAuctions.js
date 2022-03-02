import createError from 'http-errors';
import validator from '@middy/validator';

import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';
import commonMiddleware from '../lib/commonMiddleware';
import { document } from '../utils/dynamodbClient';

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;

  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  try {
    const result = await document.query(params).promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions)
  .use(validator({
    inputSchema: getAuctionsSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  }));