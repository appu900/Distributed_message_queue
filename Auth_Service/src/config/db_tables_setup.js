import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
dotenv.config();

console.log({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const createUsersTable = async () => {
  const params = {
    TableName: "Users",
    KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "email", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "EmailIndex",
        KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
        Projection: {
          ProjectionType: "ALL",
        },
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  };

  try {
    const command = new CreateTableCommand(params);
    const result = await dynamoDB.send(command);
    return result;
  } catch (error) {
    if (error.code === "ResourceInUseException") {
      console.log("Users Table Alreay exists");
    } else {
      console.log("Error in creating user table", error);
      throw error;
    }
  }
};

const createTopicsTables = async () => {
  const params = {
    TableName: "Topics",
    KeySchema: [
      { AttributeName: "topicId", KeyType: "HASH" }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "topicId", AttributeType: "S" },
      { AttributeName: "userId", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "UserIdIndex",
        KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
        Projection: {
          ProjectionType: "ALL",
        },
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  };
  try {
    const command = new CreateTableCommand(params);
    const result = await dynamoDB.send(command);
    console.log("Topics table created", result);
    return result;
  } catch (error) {
    if (error.code === "ResourceInUseException") {
      console.log("Topics table already exists");
    } else {
      console.log("Error in creating topics table", error);
      throw error;
    }
  }
};

const setupTables = async () => {
  try {
    await createUsersTable();
    await createTopicsTables();
    console.log("DynamoDB setup complete");
  } catch (error) {
    console.error("Error in setting up dynamoDB tables", error);
  }
};

setupTables();
