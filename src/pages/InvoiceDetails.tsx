import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/design/ui/button";
import { Card, CardHeader, CardTitle } from "@/design/ui/card";

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

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{invoice?.name}</span>
            <Button variant="secondary" asChild>
              <NavLink to={`/${databaseId}`}>
                <ArrowLeft className="w-h mr-2 h-4" />
                <span>Back to invoices</span>
              </NavLink>
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
