import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import authReducer from "./slices/auth";
import dashboardReducer from "./slices/dashboard";
import invoicesReducer from "./slices/invoices";
import { authSaga } from "./slices/auth/saga";
import { dashboardSaga } from "./slices/dashboard/saga";
import { invoicesSaga } from "./slices/invoices/saga";

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield all([authSaga(), dashboardSaga(), invoicesSaga()]);
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    invoices: invoicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
