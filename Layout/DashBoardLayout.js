import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icon } from "@iconify/react";
import adminRoutes from "./routes/dashboardRoutes";

const DashBoardLayout = (props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  // State for sidebar drawer
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  // Handler for toggling sidebar drawer
  const handleDrawerToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handler for closing sidebar drawer
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleLogout = () => {
    setLogoutDialogOpen(false);
    // Remove the token from local storage or cookies
    localStorage.removeItem("token");
    router.push("/login"); // Redirect to the login page
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box display="flex" alignItems="center">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchInputChange}
              sx={{ mr: 2 }}
              inputProps={{ style: { color: "white" } }}
            />
            <IconButton color="inherit" aria-label="search">
              <SearchIcon />
            </IconButton>
            <IconButton
              style={{ color: "white" }}
              color="white"
              aria-label="logout"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <p style={{ fontSize: "18px", marginRight: "5px" }}>LOG OUT</p>{" "}
              <ExitToAppIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Sidebar */}
      {/* Sidebar */}
      <Drawer open={isSidebarOpen} onClose={closeSidebar}>
        <Toolbar style={{marginTop:'20px'}} />
        {adminRoutes.map((route, i) => (
          <Link key={i} href={route.href}>
            <p style={{margin:'0px'}}
              className={
                router.pathname == route.href
                  ? "activeLink"
                  : ""
              }
            >
              <ListItem button>
                <ListItemIcon>
                  <Icon style={{ fontSize: "28px" }} icon={route.icon} />
                </ListItemIcon>
                <ListItemText
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                  primary={route.text}
                />
              </ListItem>
            </p>
          </Link>
        ))}
      </Drawer>

      {/* Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
          <div style={{ position: "relative", background: "white" }}>
            <div>{props.children}</div>
          </div>
        </Container>
      </Box>

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashBoardLayout;
