import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Loader2, LogOut, RefreshCcw } from "lucide-react";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/design/ui/alert-dialog";
import { Button } from "@/design/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/design/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/design/ui/form";
import { Input } from "@/design/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/design/ui/table";

import { DatabaseModel } from "../types/Database";
import { InvoiceModel } from "../types/Invoice";

const formSchema = z.object({
  invoiceId: z.string().min(20, {
    message: "Invoice Id looks something like this: 80d682ef-58a8-4f2c-af79-94c22a77440b",
  }),
});

export const Invoices = () => {
  const [dbData, setDbData] = useState<DatabaseModel | undefined>();
  const [invoices, setInvoices] = useState<InvoiceModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { databaseId } = useParams();

  const getDbData = () => {
    try {
      const localData = window.localStorage.getItem("database");
      if (!localData) throw new Error("no-data");
      const data = JSON.parse(localData);
      if (data.id != databaseId) throw new Error("no-data");
      setDbData(data);
    } catch (error) {
      navigate(`/?databaseId=${databaseId}`);
    }
  };

  const fetchInvoices = async (isForced: boolean = false) => {
    try {
      setIsLoading(true);
      let data: InvoiceModel[] = [];
      if (!isForced) {
        const localData = window.localStorage.getItem("invoices");
        data = JSON.parse(localData || "[]");
      }
      if (data.length == 0) {
        const apiResponse = await fetch(`/api/invoices?databaseId=${databaseId}`);
        const apiInvoices = await apiResponse.text();
        window.localStorage.setItem("invoices", apiInvoices);
        data = JSON.parse(apiInvoices);
      }
      setInvoices(data);
    } catch (error) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    navigate(`/${databaseId}/${values.invoiceId}`);
  };

  const onLogout = () => {
    navigate("/");
    window.localStorage.clear();
  };

  useEffect(() => {
    if (!dbData) {
      getDbData();
    }
  }, []);

  useEffect(() => {
    if (dbData) {
      fetchInvoices();
    }
  }, [dbData]);

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img src={dbData?.icon} className="mr-4 h-6 w-6" alt="" />
                <span>{dbData?.name}</span>
              </div>
              {/* <Input placeholder="Search..." className="w-80" /> */}
            </div>
            <div className="flex items-center justify-end space-x-4">
              <Button variant="secondary" onClick={() => fetchInvoices(true)}>
                <RefreshCcw className="w-h mr-2 h-4" />
                <span>Reload</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <LogOut className="w-h h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Do you wish to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your session will be cleared. You will have to enter your database ID again to
                      get here.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={onLogout}>Yes, Logout!</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="border-t p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.name}</TableCell>
                  <TableCell>#{invoice.number}</TableCell>
                  <TableCell>{[invoice.invoiceTo, invoice.phone].join(", ")}</TableCell>
                  <TableCell>{invoice.invoiceDate}</TableCell>
                  <TableCell>{invoice.amount.toFixed(2)}</TableCell>
                  <TableCell className="flex justify-end">
                    <Button asChild size="sm">
                      <NavLink to={`/${databaseId}/${invoice.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </NavLink>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="flex items-center justify-end space-x-4">
                        <p className="text-sm text-muted-foreground">
                          Couldn&apos;t find what you are looking for?
                        </p>
                        <FormField
                          control={form.control}
                          name="invoiceId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter your invoice Id"
                                  className="w-80"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" variant="secondary">
                          Get Invoice
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
