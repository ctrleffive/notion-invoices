import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { useAppSelector } from "../hooks/useAppSelector";

import { GetDB } from "./GetDB";
import { InvoiceDetails } from "./InvoiceDetails";
import { InvoicesList } from "./InvoicesList";

export const Root = () => {
  const dbData = useAppSelector((state) => state.app.databaseData);

  const navigate = useNavigate();

  useEffect(() => {
    if (!dbData) {
      console.log("He");
      navigate("/");
    }
  }, [dbData]);

  return (
    <Routes>
      <Route path="/" element={<GetDB />} />
      <Route path="/:databaseId" element={<InvoicesList />} />
      <Route path="/:databaseId/:invoiceId" element={<InvoiceDetails />} />
    </Routes>
  );
};
