import {  ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient , tableNamee} from '../config/dbConfig.mjs';



const tableName = tableNamee 


export const getAllItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }

    var params = {
        TableName : tableName
    };

    const response = {};

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        var items = data.Items;
        response.statusCode = 200;
        response.body = JSON.stringify(items)
       
    } catch (err) {
        response.statusCode = 500
        response.body = JSON.stringify({
          msg: 'Internal Server Error'
        })
        console.log("Error", err);
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
