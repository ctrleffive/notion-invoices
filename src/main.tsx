import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { GetDB } from "./pages/GetDB";
import { InvoiceDetails } from "./pages/InvoiceDetails";
import { Invoices } from "./pages/Invoices";
import { Root } from "./pages/Root";

import "./global.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <GetDB />,
      },
      {
        path: "/:databaseId",
        element: <Invoices />,
      },
      {
        path: "/:databaseId/:invoiceId",
        element: <InvoiceDetails />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
