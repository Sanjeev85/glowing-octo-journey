import {  PutCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocClient , tableNamee} from '../config/dbConfig.mjs';



const tableName = tableNamee 


export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    const body = JSON.parse(event.body);
    const id = body.id;
    const name = body.fName;


    var params = {
        TableName : tableName,
        Item: { id : id, fName: name }
    };
    
    const response = {};

    try {
        var data = await ddbDocClient.send(new PutCommand(params));
        response.statusCode = 200;
        response.body = JSON.stringify({
            message: 'User Added Successfully'
        })
      }
      catch(err) {
        response.statusCode = 500
        response.body = JSON.stringify({
          msg: 'Internal Server Error'
        })
        console.log('err', err.message)
      }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
