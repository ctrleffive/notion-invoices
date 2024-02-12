import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, LogOut, RefreshCcw } from "lucide-react";
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

import { AsyncState } from "../types";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

import { AppActions } from "../store/app/slice";

const formSchema = z.object({
  invoiceId: z.string().min(20, {
    message: "Invoice Id looks something like this: 80d682ef-58a8-4f2c-af79-94c22a77440b",
  }),
});

export const InvoicesList = () => {
  const databaseData = useAppSelector((state) => state.app.databaseData);
  const invoices = useAppSelector((state) => state.app.invoices);
  const invoicesState = useAppSelector((state) => state.app.invoicesState);

  const isLoading = invoicesState == AsyncState.PENDING;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { databaseId } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceId: "",
    },
  });

  const onGetInvoiceSubmit = async (values: z.infer<typeof formSchema>) => {
    navigate(`/${databaseId}/${values.invoiceId}`);
  };

  const onLogout = () => {
    dispatch(AppActions.logout());
  };

  const fetchInvoices = () => {
    dispatch(AppActions.getInvoices({ databaseId: databaseId! }));
  };

  useEffect(() => {
    if (!invoices.length && databaseData) {
      fetchInvoices();
    }
  }, []);

  if (!databaseData) return null;

  return (
    <div className="mb-14 p-2 md:container md:mb-10 md:py-8">
      <Card>
        <CardHeader>
          <CardTitle className="items-center justify-between md:flex">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img src={databaseData?.icon} className="mr-4 h-6 w-6" alt="" />
                <span>{databaseData?.name}</span>
              </div>
            </div>
            <div className="mt-6 items-center justify-end space-x-4 md:mt-0 md:flex">
              {isLoading ? (
                <Button variant="secondary" disabled>
                  <RefreshCcw className="w-h h-4 animate-spin" />
                  <span className="ml-2">loading...</span>
                </Button>
              ) : (
                <Button variant="secondary" onClick={fetchInvoices}>
                  <RefreshCcw className="w-h mr-2 h-4" />
                  <span>Refresh</span>
                </Button>
              )}
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
                    <AlertDialogCancel onClick={onLogout}>Yes</AlertDialogCancel>
                    <AlertDialogAction>No, Stay here!</AlertDialogAction>
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
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">ID</TableHead>
                <TableHead className="whitespace-nowrap">To</TableHead>
                <TableHead className="whitespace-nowrap">Due Date</TableHead>
                <TableHead className="whitespace-nowrap">Amount</TableHead>
                <TableHead className="whitespace-nowrap text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="whitespace-nowrap">{invoice.name}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <NavLink to={`/${databaseId}/${invoice.id}`}>#{invoice.number}</NavLink>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {[invoice.invoiceTo, invoice.phone].join(", ")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{invoice.invoiceDate}</TableCell>
                  <TableCell className="whitespace-nowrap">{invoice.amount.toFixed(2)}</TableCell>
                  <TableCell className="flex justify-end whitespace-nowrap">
                    <Button asChild size="sm" variant="ghost">
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
                    <form onSubmit={form.handleSubmit(onGetInvoiceSubmit)}>
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
