import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { partnersApi } from "../../services/api";
import { Partner } from "../../types";

export function PartnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Partner>>({
    name: "",
    email: "",
    gitRepository: "",
    isActive: true,
  });
  const [error, setError] = useState("");

  const { data: partner, isLoading: isLoadingPartner } = useQuery(
    ["partner", id],
    async () => {
      if (id) {
        const response = await partnersApi.get(`/${id}`);
        return response.data;
      }
      return null;
    },
    { enabled: isEditing }
  );

  const mutation = useMutation(
    async (data: Partial<Partner>) => {
      if (isEditing) {
        return partnersApi.put(`/${id}`, data);
      }
      return partnersApi.post("/", data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("partners");
        navigate("/partners");
      },
      onError: (error) => {
        setError("Erro ao salvar parceiro. Tente novamente.");
        console.error("Erro ao salvar:", error);
      },
    }
  );

  useEffect(() => {
    if (partner) {
      setFormData(partner);
    }
  }, [partner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name?.trim() || !formData.email?.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    mutation.mutate(formData);
  };

  if (isEditing && isLoadingPartner) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isEditing ? "Editar Parceiro" : "Novo Parceiro BusinessFlow"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Parceiro"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                error={!!error && !formData.name?.trim()}
                helperText={
                  !!error && !formData.name?.trim() ? "Campo obrigatório" : ""
                }
                placeholder="Insira o nome"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email do Parceiro"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                error={!!error && !formData.email?.trim()}
                helperText={
                  !!error && !formData.email?.trim() ? "Campo obrigatório" : ""
                }
                placeholder="exemplo@email.com"
                type="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Repositório Git"
                value={formData.gitRepository}
                onChange={(e) =>
                  setFormData({ ...formData, gitRepository: e.target.value })
                }
                placeholder="Insira o repositório"
                helperText="Ex: https://github.com/usuario/repositorio"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData.isActive)}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label="Empresa ativa?"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isLoading}
              size="large"
            >
              {mutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/partners")}
              disabled={mutation.isLoading}
              size="large"
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
