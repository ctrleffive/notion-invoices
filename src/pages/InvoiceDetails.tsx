import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/design/ui/button";
import { Card, CardHeader, CardTitle } from "@/design/ui/card";

import { InvoiceModel } from "../types/Invoice";

export const InvoiceDetails = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceModel | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const { databaseId, invoiceId } = useParams();

  const getInvoiceData = async () => {
    try {
      setIsLoading(true);
      const apiResponse = await fetch(
        `/api/invoices?databaseId=${databaseId}&invoiceId=${invoiceId}`,
      );
      const data = await apiResponse.json();
      setInvoiceData(data);
    } catch (error) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!invoiceData) {
      getInvoiceData();
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
            <span>{invoiceData?.name}</span>
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
