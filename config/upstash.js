import dotenv from 'dotenv';
dotenv.config();
import { Client as worlflowClient } from "@upstash/workflow";   

 export const workflowClient = new worlflowClient({
  url: process.env.QSTASH_URL,
  token: process.env.QSTASH_TOKEN,
 });