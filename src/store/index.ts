import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import invoicesReducer from './slices/invoicesSlice';
import { authSaga } from './sagas/authSaga';
import { dashboardSaga } from './sagas/dashboardSaga';
import { invoicesSaga } from './sagas/invoicesSaga';

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield all([
    authSaga(),
    dashboardSaga(),
    invoicesSaga(),
  ]);
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
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;