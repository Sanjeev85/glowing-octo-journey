import {  UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient , tableNamee} from '../config/dbConfig.mjs';
import { checkUserExistance } from '../utils/checkUserExistance.mjs';



const tableName = tableNamee 



export const updateUserById = async (event, context) => {
    if (event.httpMethod !== 'PUT') {
        throw new Error(`only put request are allowed`)
    }
    const userId = Number(event.pathParameters.id)
    const body = JSON.parse(event.body)
    const firstName = body.fName;
    const response = {};

    //check if user exists
    const userExist = await checkUserExistance(userId)
    if(!userExist) {
      response.body = JSON.stringify({
        msg: 'user not exists kindly create one',
      })
      response.statusCode= 404
      return response
    }


    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
          id: userId,
        },
        UpdateExpression: "set fName = :firstName",
        ExpressionAttributeValues: {
          ":firstName": firstName,
        },
        ReturnValues: "ALL_NEW",
      });


      try {
        const output = await ddbDocClient.send(command)
        response.statusCode = 200;
        response.body = JSON.stringify({
          user: output.Attributes,
          msg: 'user updated successfully :)'
        })
      }
      catch(err) {
        response.statusCode = 500
        response.body = JSON.stringify({
          msg: 'Internal Server Error'
        })
        console.log('err', err)
      }
      

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}