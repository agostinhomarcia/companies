import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { ListPartners } from "./pages/Partners/ListPartners";
import { PartnerForm } from "./pages/Partners/PartnerForm";
import { ListExternalCompanies } from "./pages/ExternalCompanies/ListExternalCompanies";
import { ExternalCompanyForm } from "./pages/ExternalCompanies/ExternalCompanyForm";
import { About } from "./pages/About";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: "#673AB7",
      light: "#7E57C2",
      dark: "#4527A0",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/partners" replace />} />
                <Route path="partners">
                  <Route index element={<ListPartners />} />
                  <Route path="new" element={<PartnerForm />} />
                  <Route path="edit/:id" element={<PartnerForm />} />
                </Route>
                <Route path="external-companies">
                  <Route index element={<ListExternalCompanies />} />
                  <Route path="new" element={<ExternalCompanyForm />} />
                  <Route path="edit/:id" element={<ExternalCompanyForm />} />
                </Route>
                <Route path="about" element={<About />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
