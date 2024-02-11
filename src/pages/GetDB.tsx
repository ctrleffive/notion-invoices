import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/design/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/design/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/design/ui/form";
import { Input } from "@/design/ui/input";

import { DatabaseModel } from "../types/Database";

const formSchema = z.object({
  databaseId: z.string().min(20, {
    message: "Database looks something like this: 80d682ef-58a8-4f2c-af79-94c22a77440b",
  }),
});

export const GetDB = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [query] = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      databaseId: query.get("databaseId") || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      window.localStorage.clear();
      const apiResponse = await fetch(`/api/database?databaseId=${values.databaseId}`);
      const dbDetails = await apiResponse.text();
      window.localStorage.setItem("database", dbDetails);
      navigate(`/${values.databaseId}`);
    } catch (error) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalDbData = () => {
    const localData = window.localStorage.getItem("database");
    if (localData) {
      const data: DatabaseModel = JSON.parse(localData);
      navigate(`/${data.id}`);
    }
  };

  useEffect(() => {
    getLocalDbData();
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-96 max-w-full">
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>Enter your database ID to get the invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="databaseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your database Id" />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "fetching..." : "Get Invoices"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};
