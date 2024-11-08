import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Info,
  Logout,
  Add,
  List as ListIcon,
} from "@mui/icons-material";
import Cookies from "js-cookie";

const drawerWidth = 280;

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Parceiros",
      items: [
        { text: "Cadastrar Parceiro", icon: <Add />, path: "/partners/new" },
        { text: "Listar Parceiros", icon: <ListIcon />, path: "/partners" },
      ],
    },
    {
      title: "Empresas Externas",
      items: [
        {
          text: "Cadastrar Empresa",
          icon: <Add />,
          path: "/external-companies/new",
        },
        {
          text: "Listar Empresas",
          icon: <ListIcon />,
          path: "/external-companies",
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        { text: "Sobre", icon: <Info />, path: "/about" },
        { text: "Sair", icon: <Logout />, onClick: handleLogout },
      ],
    },
  ];

  const drawer = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Gestão de Parceiros
        </Typography>
      </Toolbar>
      <Divider />
      {menuItems.map((section) => (
        <Box key={section.title}>
          <List>
            <ListItem>
              <Typography color="textSecondary" variant="subtitle2">
                {section.title}
              </Typography>
            </ListItem>
            {section.items.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.path) {
                      navigate(item.path);
                    }
                    if (mobileOpen) handleDrawerToggle();
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      ))}
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Olá, admin
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
