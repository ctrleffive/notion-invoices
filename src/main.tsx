import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";

import "@fontsource-variable/dm-sans";

import { store } from "./store";

import { Root } from "./pages/Root";

import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <HashRouter basename="/">
      <Routes>
        <Route path="/*" element={<Root />} />
      </Routes>
    </HashRouter>
  </Provider>,
);
