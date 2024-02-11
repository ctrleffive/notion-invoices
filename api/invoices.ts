import { Client } from "@notionhq/client";

const apiKey = process.env.NOTION_SECRET;
const notion = new Client({ auth: apiKey });

export async function GET(request: any) {
  try {
    const url = new URL(request.url);
    const databaseId = url.searchParams.get("databaseId");
    const invoiceId = url.searchParams.get("invoiceId");

    if (!databaseId) throw new Error("no-databaseId");

    if (!invoiceId) {
      const notionResponse = await notion.databases.query({
        database_id: databaseId,
      });

      const invoices: any[] = notionResponse.results.map((item: any) => {
        return {
          id: item.id,
          number: item.properties["Number"].formula.number,
          name: item.properties["Name"].title[0].plain_text,
          invoiceTo: item.properties["Invoice To"].rich_text[0].plain_text,
          address: item.properties["Address"].rich_text[0].plain_text,
          email: item.properties["Email"].email,
          phone: item.properties["Phone"].rich_text[0].plain_text,
          invoiceDate: item.properties["Invoice Date"].date.start,
          dueDate: item.properties["Due Date"].date.start,
          signedBy: item.properties["Signed By"].select.name,
          amount: item.properties["Amount"].number,
        };
      });

      return new Response(JSON.stringify(invoices, null, "  "));
    } else {
      const promises: any[] = await Promise.all([
        notion.pages.retrieve({ page_id: invoiceId }),
        notion.blocks.children.list({ block_id: invoiceId, page_size: 1 }),
      ]);
      const [pageResponse, contentResponse] = promises;
      const block_id = contentResponse.results[0].id;

      const tableResponse = await notion.blocks.children.list({ block_id });
      const results: any[] = tableResponse.results;

      const columnNames = results[0].table_row.cells.map((item: any) => {
        return item[0].plain_text;
      });

      results.shift();

      const items = results.map((item: any) => {
        return {
          item: item.table_row.cells[0][0].plain_text,
          quantity: Number(item.table_row.cells[1][0].plain_text),
          price: Number(item.table_row.cells[2][0].plain_text),
        };
      });

      return new Response(
        JSON.stringify(
          {
            id: pageResponse.id,
            number: pageResponse.properties["Number"].formula.number,
            name: pageResponse.properties["Name"].title[0].plain_text,
            invoiceTo: pageResponse.properties["Invoice To"].rich_text[0].plain_text,
            address: pageResponse.properties["Address"].rich_text[0].plain_text,
            email: pageResponse.properties["Email"].email,
            phone: pageResponse.properties["Phone"].rich_text[0].plain_text,
            invoiceDate: pageResponse.properties["Invoice Date"].date.start,
            dueDate: pageResponse.properties["Due Date"].date.start,
            signedBy: pageResponse.properties["Signed By"].select.name,
            amount: pageResponse.properties["Amount"].number,
            columnNames,
            items,
          },
          null,
          "  ",
        ),
        { headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || "unknown" }, null, "  "),
      { headers: { "Content-Type": "application/json" } },
    );
  }
}
