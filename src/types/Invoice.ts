export interface InvoiceModel {
  id: string;
  number: number;
  name: string;
  invoiceTo: string;
  email: string;
  phone: string;
  address: string;
  invoiceDate: string;
  dueDate: string;
  signedBy: string;
  amount: number;
  items: {
    item: string;
    quantity: number;
    price: number;
  }[];
}
