export interface InvoiceModel {
  id: string;
  company: string;
  logo: string;
  number: number;
  name: string;
  invoiceTo: string;
  email: string;
  phone: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  toAddress: string;
  fromAddress: string;
  invoiceDate: number;
  dueDate: number;
  signedBy: string;
  currency: string;
  amount: number;
  items: {
    item: string;
    quantity: number;
    price: number;
  }[];
}
