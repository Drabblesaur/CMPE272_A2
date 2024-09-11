import {
  GetItemCommand,
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const stuDBClient = new DynamoDBClient({ region: REGION });

export const handler = async (event) => {
  console.log("request:", JSON.stringify(event));
  let body;
  try {
    switch (event.httpMethod) {
      case "GET":
        //check if pathParameters exists
        if (event.pathParameters != null) {
          //grab the parameter & send to function
          body = await getStudent(event.pathParameters.student_id);
        } else {
          body = JSON.stringify("Hello World @ Lambda FROM /GET");
        }
        break;
      case "POST":
        body = await createStudent(event);
        break;
      case "PUT":
        body = await updateStudent(event);
        break;
      case "DELETE":
        body = await deleteStudent(event.pathParameters.student_id);
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `SUCCESS: "${event.httpMethod}"`,
        body: body,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "FAILURE",
        errorMsg: e.message,
        errorStack: e.stack,
      }),
    };
  }
};

const getStudent = async (id) => {
  console.log("getStudent");
  try {
    const params = {
      TableName: process.env.DYNAMO_DB_TBL_NAME,
      Key: marshall({ student_id: id }),
    };
    const { Item } = await stuDBClient.send(new GetItemCommand(params));
    console.log(Item);
    return Item ? unmarshall(Item) : {};
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const createStudent = async (event) => {
  //get the body of the event
  try {
    console.log(`createStudent event : "${event}"`);
    const studentRequest = JSON.parse(event.body);

    const params = {
      TableName: process.env.DYNAMO_DB_TBL_NAME,
      Item: marshall(studentRequest || {}),
    };

    const createStu = await stuDBClient.send(new PutItemCommand(params));
    console.log(createStu);
    return createStu;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const updateStudent = async (event) => {
  try {
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const deleteStudent = async (id) => {
  try {
    const params = {
      TableName: process.env.DYNAMO_DB_TBL_NAME,
      Key: marshall({ student_id: id }),
    };
    const deleteStu = await stuDBClient.send(new DeleteItemCommand(params));
    console.log(deleteStu);
    return deleteStu;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
