import { Client } from "@notionhq/client";

import { apiResponse, transformDatabase } from "./helpers.js";

const apiKey = process.env.NOTION_SECRET;
const notion = new Client({ auth: apiKey });

export async function GET(request: any) {
  try {
    const url = new URL(request.url);
    const databaseId = url.searchParams.get("databaseId");

    if (!databaseId) throw new Error("no-databaseId");

    const notionResponse = await notion.databases.retrieve({
      database_id: databaseId,
    });

    const database: any = notionResponse;

    return apiResponse({
      success: true,
      data: transformDatabase(database),
    });
  } catch (error) {
    return apiResponse({ success: false, message: error?.message });
  }
}
