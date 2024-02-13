import { Client } from "@notionhq/client";

import { apiResponse, transformInvoice } from "./helpers.ts";

const apiKey = process.env.NOTION_SECRET;
const notion = new Client({ auth: apiKey });

export async function GET(request: any) {
  // try {
    const url = new URL(request.url);
    const database_id = url.searchParams.get("databaseId");
    const invoiceId = url.searchParams.get("invoiceId");

    if (!database_id) throw new Error("no-databaseId");

    if (!invoiceId) {
      const notionResponse = await notion.databases.query({ database_id });
      const invoices: any[] = notionResponse.results.map((item: any) => {
        return transformInvoice(item);
      });

      return apiResponse({
        success: true,
        data: invoices,
      });
    } else {
      const promises: any[] = await Promise.all([
        notion.pages.retrieve({ page_id: invoiceId }),
        notion.blocks.children.list({ block_id: invoiceId, page_size: 1 }),
      ]);
      const [pageResponse, contentResponse] = promises;
      const block_id = contentResponse.results[0]?.id;

      const tableResponse = await notion.blocks.children.list({ block_id });

      return apiResponse({
        success: true,
        data: transformInvoice(pageResponse, tableResponse.results),
      });
    }
  // } catch (error) {
  //   return apiResponse({ success: false, message: error.message });
  // }
}
