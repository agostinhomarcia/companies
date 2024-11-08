import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

export function About() {
  const technologies = [
    { name: "React", version: "18" },
    { name: "TypeScript", version: "5" },
    { name: "Material-UI", version: "5" },
    { name: "React Query", version: "4" },
    { name: "React Router", version: "6" },
    { name: "Zustand", version: "4" },
  ];

  const features = [
    "Autenticação com persistência em cookies ou localStorage",
    "Gerenciamento de parceiros e empresas externas",
    "Paginação com URL compartilhável",
    "Layout responsivo",
    "Formulários com validação",
    "Feedback visual para ações do usuário",
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sobre o Projeto
        </Typography>

        <Typography paragraph>
          Este sistema foi desenvolvido para gerenciar parceiros e empresas
          externas integradas às nossas aplicações. O projeto foi construído com
          foco em usabilidade, performance e manutenibilidade.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Tecnologias Utilizadas
        </Typography>

        <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {technologies.map((tech) => (
            <Chip
              key={tech.name}
              label={`${tech.name} v${tech.version}`}
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>

        <Typography variant="h6" gutterBottom>
          Funcionalidades Principais
        </Typography>

        <List>
          {features.map((feature) => (
            <ListItem key={feature}>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Desenvolvimento
        </Typography>

        <Typography paragraph>
          O projeto foi iniciado com Vite, proporcionando um ambiente de
          desenvolvimento rápido e eficiente. A arquitetura foi pensada para ser
          escalável e de fácil manutenção, utilizando padrões modernos de
          desenvolvimento React.
        </Typography>

        <Typography paragraph>
          O sistema de autenticação foi implementado de forma simples mas
          funcional, permitindo que o usuário escolha entre manter-se conectado
          (usando cookies) ou não (usando localStorage).
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Versão: 1.0.0
        </Typography>
      </Paper>
    </Box>
  );
}
