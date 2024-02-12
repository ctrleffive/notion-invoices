import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";

import { ActionState, AsyncState } from "../../types";
import { DatabaseModel } from "../../types/Database";
import { InvoiceModel } from "@/app/types/Invoice";

export const initialState = {
  databaseData: undefined as DatabaseModel | undefined,
  databaseDataState: AsyncState.IDLE,

  invoices: [] as InvoiceModel[],
  invoicesState: AsyncState.IDLE,

  invoice: undefined as InvoiceModel | undefined,
  invoiceState: AsyncState.IDLE,
};

const getDatabase = createAction<{ databaseId: string }>("getDatabase");
const getInvoices = createAction<{ databaseId: string }>("getInvoices");
const getInvoice = createAction<{ databaseId: string; invoiceId: string }>("getInvoice");

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(getDatabase + ActionState.PENDING, (state) => {
      state.databaseDataState = AsyncState.PENDING;
    });
    builder.addCase(
      getDatabase + ActionState.FULFILLED,
      (state, action: PayloadAction<DatabaseModel>) => {
        state.databaseDataState = AsyncState.FULFILLED;
        state.databaseData = action.payload;
      },
    );
    builder.addCase(getDatabase + ActionState.REJECTED, (state) => {
      state.databaseDataState = AsyncState.REJECTED;
    });
    //
    builder.addCase(getInvoices + ActionState.PENDING, (state) => {
      state.invoicesState = AsyncState.PENDING;
    });
    builder.addCase(
      getInvoices + ActionState.FULFILLED,
      (state, action: PayloadAction<InvoiceModel[]>) => {
        state.invoicesState = AsyncState.FULFILLED;
        state.invoices = action.payload;
        state.invoice = undefined;
      },
    );
    builder.addCase(getInvoices + ActionState.REJECTED, (state) => {
      state.invoicesState = AsyncState.REJECTED;
    });
    //
    builder.addCase(getInvoice + ActionState.PENDING, (state) => {
      state.invoiceState = AsyncState.PENDING;
    });
    builder.addCase(
      getInvoice + ActionState.FULFILLED,
      (state, action: PayloadAction<InvoiceModel>) => {
        state.invoiceState = AsyncState.FULFILLED;
        state.invoice = action.payload;
      },
    );
    builder.addCase(getInvoice + ActionState.REJECTED, (state) => {
      state.invoiceState = AsyncState.REJECTED;
    });
  },
});

// All reducers from this slice should go here.
export const AppActions = { ...slice.actions, getDatabase, getInvoices, getInvoice };

export const appSlice = slice.reducer;
