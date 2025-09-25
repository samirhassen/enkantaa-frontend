import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../../services/ApiService";
import { authActions } from "../../slices/auth";
import { getErrorMessage } from "../../../services/apiUtils";
import { LoginCredentials, AuthResponse } from "../../../types";

function* loginSaga(action: PayloadAction<LoginCredentials>) {
  try {
    const response: { data: AuthResponse } = yield call(
      ApiService.post,
      "/api/users/login",
      action.payload
    );

    const { accessToken, user } = response.data;

    ApiService.setAuthToken(accessToken);

    yield put(authActions.loginSuccess({ token: accessToken, user }));
  } catch (error: unknown) {
    const msg = getErrorMessage(error, "Login failed");
    yield put(authActions.loginFailure(msg));
  }
}

function* logoutSaga() {
  ApiService.removeAuthToken();
  yield put(authActions.logoutSuccess());
}

function* initAuthSaga() {
  const token = localStorage.getItem("authToken");
  if (token) {
    ApiService.setAuthToken(token);
    yield put(authActions.initSuccess({ token }));
  } else {
    yield put(authActions.initComplete());
  }
}

export function* authSaga() {
  yield takeEvery(authActions.login.type, loginSaga);
  yield takeEvery(authActions.logout.type, logoutSaga);
  yield takeEvery(authActions.initAuth.type, initAuthSaga);
}
