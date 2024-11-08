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
    description: "",
    integration_type: "",
    clients: [],
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

    if (!formData.name?.trim() || !formData.integration_type?.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios");
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
          {isEditing ? "Editar Parceiro" : "Novo Parceiro"}
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
                label="Nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                error={!!error && !formData.name?.trim()}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tipo de Integração"
                value={formData.integration_type}
                onChange={(e) =>
                  setFormData({ ...formData, integration_type: e.target.value })
                }
                required
                error={!!error && !formData.integration_type?.trim()}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clientes (separados por vírgula)"
                value={formData.clients?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clients: e.target.value
                      .split(",")
                      .map((client) => client.trim()),
                  })
                }
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
              onClick={() => navigate("/partners")}
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
