import {  GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient , tableNamee} from '../config/dbConfig.mjs';
const tableName = tableNamee

export const checkUserExistance = async(userID) => {
  
    const command = new GetCommand({
        TableName: tableName,
        Key: {
          id: userID
        }
      });

    
    const res = await ddbDocClient.send(command);
    if (!res.Item) return false;
    return true
}