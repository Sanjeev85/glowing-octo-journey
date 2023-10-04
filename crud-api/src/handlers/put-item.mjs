// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
// const { DynamoDBClient, ListTablesCommand, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
export const endpoint = 'https://8000-sanjeev85-glowingoctojo-4jdfyiben8k.ws-us105.gitpod.io';
const client = new DynamoDBClient({
    endpoint
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
// const tableName = process.env.SAMPLE_TABLE;
const tableName = "USERS";
console.log('SAMPLE TABLE NAME =======> ', tableName)
const createTableIfNotExists = async () => {
    try {
      // List all existing table names
      const listTablesParams = {};
      const existingTableNames = await ddbDocClient.send(new ListTablesCommand(listTablesParams));
      console.log('tables list =?', existingTableNames.TableNames)
  
      // Check if the table already exists
      if (!existingTableNames.TableNames.includes(tableName)) {
        // Define the table schema
        const createTableParams = {
          TableName: tableName,
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }, // 'id' as the hash key
          ],
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'N' }, // 'id' as a number
            { AttributeName: 'name', AttributeType: 'S' }, // 'name' as a string
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        };
  
        // Create the DynamoDB table
        await ddbDocClient.send(new CreateTableCommand(createTableParams));
        console.log('Table created');
      } else {
        console.log('Table already exists');
      }
    } catch (error) {
      // Check if the error is a ResourceNotFoundException
      if (error.name === 'ResourceNotFoundException') {
        console.error('Table does not exist');
      } else {
        console.error('Error', error);
      }
    }
  };
  
  // Call the function to create the table if it doesn't exist


/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
    await   createTableIfNotExists();
    console.log('AFTER ALL THE OPERATIONS++++++++++++++++++++++++++++++')
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    // console.info('received:', event);
    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = body.id;
    const name = body.name;
    console.log('reached here ---======')


    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: { id : id, name: name }
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
      } catch (err) {
        console.log('PRINTING ERROR $$$$$$$$$$$$$$$$$$$$$$$$$$$$')
        console.log("Error", err.stack);
      }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
