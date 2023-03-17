import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient";

interface ITodos {
    user_id: string;
    id: string;
    title: string;
    done: boolean;
    deadline: Date;
}

export const handle : APIGatewayProxyHandler = async(event) => {

    const { id } = event.pathParameters;

    const user_id = id

    /* Criar validação de ID de usuário */


    const todosByUser = await document
        .query({
            TableName: 'todos',
            Select:'ALL_ATTRIBUTES',
            KeyConditionExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ":user_id": user_id
            }
        })
        .promise();


        if(!todosByUser.Items[0]){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "No Data"
                })
            }
        }

      
        
        const todos = todosByUser.Items[0] as ITodos

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'List of all todos by User',
            todos
        })
    }
}