// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({
  endpoint:'https://8000-sanjeev85-glowingoctojo-4jdfyiben8k.ws-us105.gitpod.io'
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = "USERS";

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
export const getByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  // console.info('received:', event);
 
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const userID = Number(event.pathParameters.id);
  console.log('id for the request', userID);
  const idByMe = 1;
  console.log(userID === idByMe)
  console.log(typeof userID)
  console.log(typeof idByMe)
  console.log('---------------------------------')
 
  // Get the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  var params = {
    TableName : tableName,
    Key: { id: userID },
  };
  console.log('params', params)

  const listTablesParams = {TableName : tableName};

  const existingTableNames = await ddbDocClient.send(new ListTablesCommand(listTablesParams));
  console.log('Existing tables',existingTableNames )
  const command = new GetCommand({
    TableName: "USERS",
    Key: {
      id: userID
    }
  });
  try {
    const data = await ddbDocClient.send(command);
    var item = data;
  } catch (err) {
    console.log("Error", err);
  }
 
  const response = {
    statusCode: 200,
    body: JSON.stringify(item)
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
