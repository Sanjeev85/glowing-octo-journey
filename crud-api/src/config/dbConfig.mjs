import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const endpoint = 'https://8000-sanjeev85-glowingoctojo-4jdfyiben8k.ws-us105.gitpod.io'  
export const client = new DynamoDBClient({
    endpoint
});
export const ddbDocClient = DynamoDBDocumentClient.from(client);

export const tableNamee = process.env.TABLE_NAMEEE 
console.log("mytable => ", tableNamee)
console.log('=========================')
