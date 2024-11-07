import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Cookies from "js-cookie";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepConnected, setKeepConnected] = useState(false);

  const handleLogin = () => {
    if (keepConnected) {
      Cookies.set("user", username, { expires: 7 });
    } else {
      localStorage.setItem("user", username);
    }
    navigate("/partners");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: 300 }}>
        <TextField
          fullWidth
          label="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={keepConnected}
              onChange={(e) => setKeepConnected(e.target.checked)}
            />
          }
          label="Manter conectado"
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
}
