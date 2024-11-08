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
import { externalCompaniesApi } from "../../services/api";
import { ExternalCompany } from "../../types";

export function ExternalCompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<ExternalCompany>>({
    name: "",
    sector: "",
    active: true,
    numberOfEmployees: 0,
    created_at: new Date().toISOString(),
  });
  const [error, setError] = useState("");

  const { data: company, isLoading: isLoadingCompany } = useQuery(
    ["external-company", id],
    async () => {
      if (id) {
        const response = await externalCompaniesApi.get(`/${id}`);
        return response.data;
      }
      return null;
    },
    { enabled: isEditing }
  );

  const mutation = useMutation(
    async (data: Partial<ExternalCompany>) => {
      const payload = {
        ...data,
        created_at: isEditing ? data.created_at : new Date().toISOString(),
      };

      if (isEditing) {
        return externalCompaniesApi.put(`/${id}`, payload);
      }
      return externalCompaniesApi.post("/", payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("external-companies");
        navigate("/external-companies");
      },
      onError: (error) => {
        setError("Erro ao salvar empresa. Tente novamente.");
        console.error("Erro ao salvar:", error);
      },
    }
  );

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name?.trim() || !formData.sector?.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    mutation.mutate(formData);
  };

  if (isEditing && isLoadingCompany) {
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
          {isEditing ? "Editar Empresa Externa" : "Nova Empresa Externa"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Empresa"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                error={!!error && !formData.name?.trim()}
                helperText={
                  !!error && !formData.name?.trim() ? "Campo obrigatório" : ""
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Setor"
                value={formData.sector}
                onChange={(e) =>
                  setFormData({ ...formData, sector: e.target.value })
                }
                required
                error={!!error && !formData.sector?.trim()}
                helperText={
                  !!error && !formData.sector?.trim() ? "Campo obrigatório" : ""
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Número de Colaboradores"
                value={formData.numberOfEmployees || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfEmployees: parseInt(e.target.value) || 0,
                  })
                }
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData.active)}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label="Empresa Ativa"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>

            <Button
              type="button"
              onClick={() => navigate("/external-companies")}
              disabled={mutation.isLoading}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
