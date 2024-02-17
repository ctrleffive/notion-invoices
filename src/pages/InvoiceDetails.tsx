import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

import { ArrowLeft, Loader2, Printer, RefreshCcw } from "lucide-react";

import { Button } from "@/design/ui/button";
import { Card, CardHeader, CardTitle } from "@/design/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/design/ui/table";

import { AsyncState } from "../types";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

import { AppActions } from "../store/app/slice";

export const InvoiceDetails = () => {
  const invoice = useAppSelector((state) => state.app.invoice);
  const invoiceState = useAppSelector((state) => state.app.invoiceState);

  const isLoading = invoiceState == AsyncState.PENDING;

  const dispatch = useAppDispatch();
  const { databaseId, invoiceId } = useParams();

  const getInvoice = async () => {
    dispatch(AppActions.getInvoice({ invoiceId: invoiceId!, databaseId: databaseId! }));
  };

  useEffect(() => {
    if (invoice?.id != invoiceId) {
      getInvoice();
    }
  }, []);

  const [signedByName, signedByDesignation] = (invoice?.signedBy || "").split(" - ");

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mb-14 p-2 md:container md:mb-10 md:py-8 print:m-0">
      <Card className="mb-4 print:hidden">
        <CardHeader>
          <CardTitle className="items-center justify-between md:flex">
            <div className="mb-4 flex items-end justify-between space-x-4 md:mb-0 md:justify-start">
              <span>{invoice?.name}</span>
              <small className="text-muted-foreground">#{invoice?.number}</small>
            </div>
            <div className="flex items-center justify-between gap-4 md:justify-start">
              <Button variant="secondary" asChild>
                <NavLink to={`/${databaseId}`}>
                  <ArrowLeft className="w-h mr-2 h-4" />
                  <span className="hidden md:inline-block">Back to invoices</span>
                </NavLink>
              </Button>
              <Button variant="secondary" onClick={getInvoice}>
                <RefreshCcw className="w-h mr-2 h-4" />
                <span>Refresh</span>
              </Button>
              <Button onClick={() => window.print()}>
                <Printer className="w-h mr-2 h-4" />
                <span>Print</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="p-8 print:border-none print:p-0 print:shadow-none">
        <div className="flex items-end justify-between overflow-hidden">
          <div className="flex items-center gap-4">
            {invoice?.logo && <img src={invoice?.logo} className="w-14" />}
            <div className="text-xl font-extrabold uppercase">
              {invoice?.company.split(" ").map((item, index) => {
                return <div key={index}>{item}</div>;
              })}
            </div>
          </div>
          <div className="font-extrabold uppercase md:text-4xl print:text-4xl">Invoice</div>
        </div>
        <div className="mb-6 mt-6 border-b" />
        <div className="mb-8 grid-cols-2 items-end justify-between md:grid print:grid">
          <div className="space-y-2">
            <div className="mb-4 font-bold uppercase text-muted-foreground">Invoice To:</div>
            <div className="text-2xl font-bold">{invoice?.invoiceTo}</div>
            <div>{invoice?.toAddress}</div>
            <div>{[invoice?.phone, invoice?.email].filter(item => item).join(", ")}</div>
          </div>
          <div className="mt-6 space-y-2 md:mt-0 md:text-right print:mt-0 print:text-right">
            <div>
              Invoice ID: <span className="font-bold">#{invoice?.number}</span>
            </div>
            <div>
              <div>
                Invoice Date:{" "}
                <span className="font-bold">
                  {new Date(invoice?.invoiceDate || "0").toDateString()}
                </span>
              </div>
              <div>
                Due Date:{" "}
                <span className="font-bold">
                  {new Date(invoice?.dueDate || "0").toDateString()}
                </span>
              </div>
            </div>
            <div>
              Total Due:{" "}
              <span className="font-bold">
                {invoice?.currency} {invoice?.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow className="uppercase">
              <TableHead className="w-0 whitespace-nowrap font-bold print:p-2">#</TableHead>
              <TableHead className="whitespace-nowrap font-bold print:p-2">Item</TableHead>
              <TableHead className="whitespace-nowrap font-bold print:p-2">Quantity</TableHead>
              <TableHead className="whitespace-nowrap text-right font-bold print:p-2">
                Price
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice?.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap print:p-2">{index + 1}</TableCell>
                <TableCell className="whitespace-nowrap print:p-2">{item.item}</TableCell>
                <TableCell className="w-0 whitespace-nowrap print:p-2">{item.quantity}</TableCell>
                <TableCell className="w-40 whitespace-nowrap text-right print:p-2">
                  {invoice?.currency} {item.price.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}></TableCell>
              <TableCell className="font-extrabold uppercase print:p-2">Total</TableCell>
              <TableCell className="text-right font-extrabold print:p-2">
                {invoice?.currency} {invoice?.amount.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="inset-x-0 bottom-0 print:fixed">
          <div className="mb-8 mt-10 grid grid-cols-2">
            <div className="space-y-1">
              <div className="text-xl font-bold">{signedByName}</div>
              <div className="text-muted-foreground">{signedByDesignation}</div>
              <div className="pt-2 font-bold">{invoice?.company}</div>
              <div>{invoice?.fromAddress}</div>
            </div>
          </div>
          <div className="items-center justify-between border-t pt-4 md:flex print:flex">
            <div>{invoice?.contactPhone}</div>
            <div>{invoice?.contactEmail}</div>
            <div>{invoice?.contactLocation}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
