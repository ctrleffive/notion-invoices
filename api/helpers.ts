export const transformDatabase = (rawData: any) => {
  return {
    id: rawData?.id,
    name: rawData?.title[0]?.plain_text,
    icon: rawData?.icon?.file?.url,
    emoji: rawData?.icon?.emoji,
  };
};

export const transformInvoice = (rawData: any, rawItems: any = undefined) => {
  const invoiceItems = [...(rawItems || [])];

  invoiceItems.shift();

  const items = invoiceItems.map((item: any) => {
    return {
      item: item?.table_row?.cells[0][0]?.plain_text,
      quantity: Number(item?.table_row?.cells[1][0]?.plain_text || 0),
      price: Number(item?.table_row?.cells[2][0]?.plain_text || 0),
    };
  });

  return {
    id: rawData?.id,
    number: rawData?.properties["Number"]?.rich_text[0]?.plain_text,
    currency: rawData?.properties["Currency"]?.rich_text[0]?.plain_text,
    company: rawData?.properties["Company"]?.rich_text[0]?.plain_text,
    logo: rawData?.properties["Logo"]?.rich_text[0]?.plain_text,
    name: rawData?.properties["Name"]?.title[0]?.plain_text,
    invoiceTo: rawData?.properties["Invoice To"]?.rich_text[0]?.plain_text,
    fromAddress: rawData?.properties["From Address"]?.rich_text[0]?.plain_text,
    toAddress: rawData?.properties["To Address"]?.rich_text[0]?.plain_text,
    email: rawData?.properties["Email"]?.rich_text[0]?.plain_text,
    phone: rawData?.properties["Phone"]?.rich_text[0]?.plain_text,
    contactEmail: rawData?.properties["Contact Email"]?.rich_text[0]?.plain_text,
    contactPhone: rawData?.properties["Contact Phone"]?.rich_text[0]?.plain_text,
    contactLocation: rawData?.properties["Contact Location"]?.rich_text[0]?.plain_text,
    dueDate: new Date(rawData?.properties["Due Date"]?.date?.start || "0").getTime(),
    invoiceDate: new Date(rawData?.properties["Invoice Date"]?.date?.start || "0").getTime(),
    signedBy: rawData?.properties["Signed By"]?.select?.name,
    amount: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    items,
  };
};

export const apiResponse = (data: any) => {
  return new Response(JSON.stringify(data, null, "  "), {
    headers: { "Content-Type": "application/json" },
  });
};
