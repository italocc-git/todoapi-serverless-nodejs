import { APIGatewayProxyHandler } from 'aws-lambda';
import dayjs from 'dayjs';
import {v4 as uuidV4} from 'uuid'
import { document } from "../utils/dynamodbClient";
interface ITodo {
    user_id?: string;
    id?: string;
    title: string;
    done?: boolean;
    deadline: string;
}

export const handle : APIGatewayProxyHandler = async(event) => {

    const { id } = event.pathParameters;

    const user_id = id

    const body = JSON.parse(event.body) as ITodo

    const {title , deadline} = body

    const todosByUser = await document
        .query({
            TableName: 'todos',
            KeyConditionExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ":user_id": user_id
            }
        })
        .promise();
        

    const data : ITodo = {
        user_id,
        title,
        id : uuidV4(),
        done : false,
        deadline : dayjs(deadline).format('DD/MM/YYYY'),
    }

    await document.put({
        TableName:'todos',
        Item: data
    }).promise()

   
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo criado com sucesso!"
        })
    }
}