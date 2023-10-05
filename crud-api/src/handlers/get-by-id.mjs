import {  GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient , tableNamee} from '../config/dbConfig.mjs';
import { checkUserExistance } from '../utils/checkUserExistance.mjs';



const tableName = tableNamee 


export const getByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  const userID = Number(event.pathParameters.id);
  const response = {};

  //check if user exists
  const userExist = await checkUserExistance(userID)
  if(!userExist) {
    response.body = JSON.stringify({
      msg: 'user not exists kindly create one',
    })
    response.statusCode= 404
    return response
  }

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      id: userID
    }
  });


  try {
    const data = await ddbDocClient.send(command);
    var item = data.Item;
    response.statusCode = 200;
    response.body = JSON.stringify(item)
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
}
