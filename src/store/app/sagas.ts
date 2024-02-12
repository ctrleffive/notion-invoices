import { call, put, takeLatest } from "redux-saga/effects";

import { ActionState } from "../../types";

import { AppActions } from "./slice";

import * as API from "./service";

export const appSagas = [
  (function* () {
    yield takeLatest(AppActions.getDatabase, function* (action): any {
      try {
        yield put({ type: AppActions.getDatabase + ActionState.PENDING });

        const data = yield call(async () => {
          return await API.getDatabase(action.payload.databaseId);
        });

        if (!data) throw new Error();
        if (!data.success) throw new Error(data?.message);

        yield put({
          type: AppActions.getDatabase + ActionState.FULFILLED,
          payload: data.data,
        });
      } catch (error: any) {
        yield put({
          type: AppActions.getDatabase + ActionState.REJECTED,
          payload: error?.message,
        });
      }
    });
  })(),
  (function* () {
    yield takeLatest(AppActions.getInvoices, function* (action): any {
      try {
        yield put({ type: AppActions.getInvoices + ActionState.PENDING });

        const data = yield call(async () => {
          return await API.getInvoices(action.payload.databaseId);
        });

        if (!data) throw new Error();
        if (!data.success) throw new Error(data?.message);

        yield put({
          type: AppActions.getInvoices + ActionState.FULFILLED,
          payload: data.data,
        });
      } catch (error: any) {
        yield put({
          type: AppActions.getInvoices + ActionState.REJECTED,
          payload: error?.message,
        });
      }
    });
  })(),
  (function* () {
    yield takeLatest(AppActions.getInvoice, function* (action): any {
      try {
        yield put({ type: AppActions.getInvoice + ActionState.PENDING });

        const data = yield call(async () => {
          return await API.getInvoice(action.payload);
        });

        if (!data) throw new Error();
        if (!data.success) throw new Error(data?.message);

        yield put({
          type: AppActions.getInvoice + ActionState.FULFILLED,
          payload: data.data,
        });
      } catch (error: any) {
        yield put({
          type: AppActions.getInvoice + ActionState.REJECTED,
          payload: error?.message,
        });
      }
    });
  })(),
];
