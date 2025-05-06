import { dynamoDB, TableNames } from "../config/db.config.js";
import {
  QueryCommand,
  PutItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

class UserModel {
  static async create(userData) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const params = {
      TableName: TableNames.USERS,
      Item: marshall({
        userId,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    };
    try {
      const command = new PutItemCommand(params);
      const response = await dynamoDB.send(command);
      console.log(response);
      const { password, ...user } = unmarshall(params.Item);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    const params = {
      TableName: TableNames.USERS,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: marshall({
        ":email": email,
      }),
    };
    try {
      const command = new QueryCommand(params);
      const result = await dynamoDB.send(command);
      console.log(result);
      const items = result.Items
        ? result.Items.map((item) => unmarshall(item))
        : [];
      return items[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }
}



export default UserModel