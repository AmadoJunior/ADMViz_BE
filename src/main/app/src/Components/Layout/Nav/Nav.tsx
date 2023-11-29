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
    fetch(`/api/perform_logout`)
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
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{
        width: "100%",
        paddingX: "20px",
        maxWidth: "100%"
      }}>
        <Toolbar  variant="dense" disableGutters>
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
                return (
                  <Box key={item.path}>
                    <Link
                      to={item.path}
                    >
                      <MenuItem
                        onClick={handleCloseNavMenu}
                        disabled={!userDetailsContext?.isAuthenticated}
                      >
                        <ListItemIcon>
                          <item.icon/>
                        </ListItemIcon>
                        <ListItemText disableTypography>
                          <Typography sx={{
                            color: "white"
                          }}>{item.title}</Typography>
                        </ListItemText>
                      </MenuItem>
                    </Link>
                    {index < pages?.length - 1 && <Divider></Divider>}
                  </Box>
                );
              })}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              return (
                <Link key={page.path} to={`${page?.path}`}>
                  <Button
                    disabled={!userDetailsContext?.isAuthenticated}
                    variant="outlined"
                    key={page?.path}
                    onClick={handleCloseNavMenu}
                    size="small"
                    sx={[
                      {
                        mx: 1,
                      },
                    ]}
                  >
                    <Typography variant="subtitle2">{page?.title}</Typography>
                  </Button>
                </Link>
              );
            })}
          </Box>
            {userDetailsContext.isAuthenticated && <Button 
              onClick={handleLogout} 
              variant="outlined"
              color="error"
              size="small"
              >
                Log Out
            </Button>}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Nav;
