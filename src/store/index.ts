import { configureStore } from "@reduxjs/toolkit";
import persistState from "redux-localstorage";
import createSagaMiddleware from "redux-saga";

import { appSlice } from "./app/slice";

import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(persistState([])),
  devTools: true,
});

sagaMiddleware.run(rootSaga);
