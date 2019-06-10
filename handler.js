'use strict';

const AWS = require('aws-sdk');

const MESSAGES_TABLE = process.env.MESSAGES_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});

module.exports.createRegistration = async (event, context) => {

  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 500,
      error: `Could not parse requested JSON: ${err.stack}`
    };
  }
  const { nombre, telefono, email, rut } = _parsed;

  const params = {
    TableName: MESSAGES_TABLE,
    Item: {
        nombre, telefono, email, rut
    },
  };

  try {
    const data = await dynamoDb.put(params).promise();
    console.log(`createRegistration data=${JSON.stringify(data)}`);
//    return { statusCode: 200, body: "Proceso exitoso" };
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (error) {
    console.log(`createRegistration ERROR=${error.stack}`);
    return {
      statusCode: 400,
      error: `Could not create message: ${error.stack}`
    };
  }
};
