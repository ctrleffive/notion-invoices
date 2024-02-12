import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

import { AppActions } from "../store/app/slice";

import { GetDB } from "./GetDB";
import { InvoiceDetails } from "./InvoiceDetails";
import { InvoicesList } from "./InvoicesList";

export const Root = () => {
  const dbData = useAppSelector((state) => state.app.databaseData);

  const navigate = useNavigate();
  const routeLocation = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (routeLocation.pathname != "/") {
      const [databaseId] = routeLocation.pathname.split("/").filter((item) => item);
      if (!dbData) {
        navigate("/", {
          state: { databaseId },
        });
      } else if (dbData.id != databaseId) {
        dispatch(AppActions.logout());
      }
    }
  }, [routeLocation, dbData]);

  return (
    <>
      <Routes>
        <Route path="/" element={<GetDB />} />
        <Route path="/:databaseId" element={<InvoicesList />} />
        <Route path="/:databaseId/:invoiceId" element={<InvoiceDetails />} />
      </Routes>
      <div className="fixed inset-x-0 bottom-0 -z-10 mb-6 text-center text-sm text-muted-foreground print:hidden">
        Made by{" "}
        <a href="https://chandujs.com" target="_blank" rel="noreferrer">
          Chandu
        </a>{" "}
        with ♥️
      </div>
    </>
  );
};
