export const getDatabase = async (databaseId: string) => {
  const apiResponse = await fetch(`/api/database?databaseId=${databaseId}`);
  return apiResponse.json();
};

export const getInvoices = async (databaseId: string) => {
  const apiResponse = await fetch(`/api/invoices?databaseId=${databaseId}`);
  return apiResponse.json();
};

export const getInvoice = async (params: { databaseId: string; invoiceId: string }) => {
  const apiResponse = await fetch(
    `/api/invoices?databaseId=${params.databaseId}&invoiceId=${params.invoiceId}`,
  );
  return apiResponse.json();
};
