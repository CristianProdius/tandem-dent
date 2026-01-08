"use client";

import { Account, Client } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

export const clientAccount = new Account(client);
export { client };
