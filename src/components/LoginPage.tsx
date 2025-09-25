import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { authActions } from "../store/slices/auth";
import {
  selectAuthLoading,
  selectAuthError,
} from "../store/slices/auth/selector";

const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(0, 163, 224, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(2, 136, 209, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(0, 163, 224, 0.05) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const LoginPaper = styled(Paper)`
  padding: 40px;
  max-width: 400px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
`;

const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;

  img {
    height: 48px;
    width: auto;
  }
`;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const handleSubmit = (values: { name: string; password: string }) => {
    dispatch(authActions.login(values));
  };

  const handleErrorClose = () => {
    dispatch(authActions.clearError());
  };

  return (
    <LoginContainer maxWidth={false}>
      <LoginPaper elevation={0}>
        <LogoContainer>
          <img src="/image.png" alt="Ekaanta" />
        </LogoContainer>

        <Box textAlign="center" mb={4}>
          <Typography
            variant="h5"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Invoice Dashboard
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#4a5568",
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            Access your electric utility data
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" onClose={handleErrorClose} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ name: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Box mb={2}>
                <TextField
                  fullWidth
                  name="name"
                  label="Username"
                  variant="outlined"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  size="small"
                  error={touched.name && Boolean(errors.name)}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "#d32f2f",
                      },
                    },
                  }}
                />
                {touched.name && errors.name && (
                  <FormHelperText
                    error
                    sx={{
                      ml: 0,
                      mt: 0.5,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {errors.name}
                  </FormHelperText>
                )}
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  size="small"
                  error={touched.password && Boolean(errors.password)}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-error": {
                      "& fieldset": {
                        borderColor: "#d32f2f",
                      },
                    },
                  }}
                />
                {touched.password && errors.password && (
                  <FormHelperText
                    error
                    sx={{
                      ml: 0,
                      mt: 0.5,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {errors.password}
                  </FormHelperText>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="medium"
                disabled={loading}
                sx={{
                  height: "44px",
                  background:
                    "linear-gradient(135deg, #00A3E0 0%, #0288D1 100%)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </LoginPaper>
    </LoginContainer>
  );
};

export default LoginPage;
