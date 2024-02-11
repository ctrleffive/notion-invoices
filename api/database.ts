import { Client } from "@notionhq/client";

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

    return new Response(
      JSON.stringify(
        {
          id: database.id,
          name: database.title[0]?.plain_text,
          icon: database.icon?.file?.url,
        },
        null,
        "  ",
      ),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error?.message || "unknown" }, null, "  "),
      { headers: { "Content-Type": "application/json" } },
    );
  }
}
