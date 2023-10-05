import {  DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient , tableNamee} from '../config/dbConfig.mjs';
import { checkUserExistance } from '../utils/checkUserExistance.mjs';



const tableName = tableNamee 

export async function delteUserById (event, context) {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`only delete method is accedpted you tried ${event.httpMethod}`)
    }

    const userId = Number(event.pathParameters.id)

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

    const command = new DeleteCommand({
        TableName: tableName,
        Key: {
          id: userId,
        },
      });
    
    try {
        const output = await ddbDocClient.send(command)
        response.statusCode = 200
        response.body = JSON.stringify({
            msg: `user with id:${userId} deleted succesfully :>`
        })
    }catch(err) {
        response.statusCode = 500
        response.body = JSON.stringify({message: "Internal Server Error"})
        console.log('error', err.message)
    }
    return response
    
}