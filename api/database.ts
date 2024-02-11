import { Client } from "@notionhq/client";

const apiKey = process.env.NOTION_SECRET;
const notion = new Client({ auth: apiKey });

export async function GET(request: any) {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    if (!name) throw new Error("no-name");

    const notionResponse = await notion.search({
      query: name,
      filter: {
        value: "database",
        property: "object",
      },
    });

    const database: any = notionResponse.results[0];
    if (!database) throw new Error("not-found");

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
      // { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error?.message || "unknown" }, null, "  "),
    );
  }
}
