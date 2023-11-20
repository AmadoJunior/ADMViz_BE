//Deps
import React from "react";
import { Link, useLocation } from "react-router-dom";

//MUI
import {
  Box,
  Typography,
  AppBar,
  Menu,
  MenuItem,
  Button,
  Container,
  Toolbar,
  SvgIcon,
  IconButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
} from "@mui/material";

//Context
import { UserDetailsContext } from "../../../Context/UserDetailsContext/useUserDetailsContext";

//Icons
import MenuIcon from "@mui/icons-material/Menu";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MapIcon from "@mui/icons-material/Map";

//Props
interface INavProps {
  children?: React.ReactNode;
}

//Pages
interface IPage {
  title: string;
  path: string;
  icon: typeof SvgIcon;
}
const pages: IPage[] = [
  {
    title: "Dashboards",
    path: "/",
    icon: QueryStatsIcon,
  },
  {
    title: "About",
    path: "/about",
    icon: MapIcon,
  },
];

const Nav: React.FC<INavProps> = (): JSX.Element => {
  const userDetailsContext = React.useContext(UserDetailsContext);
  const theme = useTheme();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleLogout = () => {
    console.log("logging out");
    const basePath = "http://localhost:8080"
    fetch(`${basePath}/api/perform_logout`)
    .then(response => {
      console.log(response);
      userDetailsContext.clearAuthentication();
    })
    .catch(e => {
      console.error(e);
    })
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              marginRight: 2,
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Typography variant="h6" color="primary">OpenViz</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="medium"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={[
                {
                  backgroundColor: "primary.main",
                },
                () => ({
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }),
              ]}
            >
              <MenuIcon sx={{}} />
            </IconButton>
            <Menu
              elevation={1}
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages?.map((item, index) => {
                const isCurrentPath = location.pathname === item.path;
                return (
                  <Box key={item.path}>
                    <Link
                      to={item.path}
                      style={{
                        color: isCurrentPath
                          ? theme.palette.primary.main
                          : "black",
                      }}
                      reloadDocument
                    >
                      <MenuItem
                        onClick={handleCloseNavMenu}
                        sx={[
                          {},
                          () => ({
                            "&:hover *": {
                              color: "secondary.main",
                            },
                          }),
                        ]}
                      >
                        <ListItemIcon>
                          <item.icon
                            sx={{
                              color: isCurrentPath
                                ? theme.palette.primary.main
                                : "black",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText disableTypography>
                          <Typography>{item.title}</Typography>
                        </ListItemText>
                      </MenuItem>
                    </Link>
                    {index < pages?.length - 1 && <Divider></Divider>}
                  </Box>
                );
              })}
            </Menu>
          </Box>

          <Box
            sx={{
              marginRight: 6,
              flexGrow: 1,
              display: {
                xs: "block",
                md: "none",
              },
            }}
          >
            <Typography>OpenViz</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              return (
                <Link key={page.path} to={`${page?.path}`} reloadDocument>
                  <Button
                    variant="contained"
                    key={page?.path}
                    onClick={handleCloseNavMenu}
                    sx={[
                      {
                        my: 1,
                        mx: 1,
                        padding: "5px 15px 5px 15px !important",
                        display: "block",
                      },
                      () => ({
                        "&:hover": {},
                      }),
                    ]}
                  >
                    <Typography variant="subtitle2">{page?.title}</Typography>
                  </Button>
                </Link>
              );
            })}
          </Box>
            <Button onClick={handleLogout} sx={{
              backgroundColor: "error.main",
              color: "white"
            }}>Log Out</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Nav;
