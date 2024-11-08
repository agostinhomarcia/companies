import "./App.css";
import { ListPartners } from "./pages/Partners/ListPartners";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/partners" replace />} />
          <Route path="partners" element={<ListPartners />} />
          {/* ... outras rotas ... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
