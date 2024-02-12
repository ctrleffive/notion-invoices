import { all } from "redux-saga/effects";

import { appSagas } from "./app/sagas";

export function* rootSaga() {
  yield all([...appSagas]);
}
