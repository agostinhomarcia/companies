import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepConnected, setKeepConnected] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const isAuthenticated = login(
        username.trim(),
        password.trim(),
        keepConnected
      );

      if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/partners";
        navigate(from, { replace: true });
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (error) {
      setError("Erro ao realizar login. Tente novamente.");
      console.error("Erro no login:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoComplete="username"
            autoFocus
            error={!!error}
            placeholder="admin"
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
            error={!!error}
            placeholder="123456"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={keepConnected}
                onChange={(e) => setKeepConnected(e.target.checked)}
                color="primary"
              />
            }
            label="Manter conectado"
            sx={{ mt: 1 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!username.trim() || !password.trim()}
          >
            Entrar
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
          >
            Use admin / 123456 para acessar
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
