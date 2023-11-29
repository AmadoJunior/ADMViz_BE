//Deps
import React from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Routes, Route } from "react-router-dom";

//Css
import './App.css';

//MUI
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

//Component
import Layout from "./Components/Layout/Layout";

//Context
import {useUserDetailsContext, UserDetailsContext} from "./Context/UserDetailsContext/useUserDetailsContext";

import Authenticate from './Components/Authenticate/Authenticate';
import Login from './Components/Authenticate/Login';
import Register from './Components/Authenticate/Register';
import About from './Components/About/About';
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import DashboardGrid from "./Components/DashboardGrid/DashboardGrid";

//Darkest #08090a
//Gray #111214
//Border #302f2f
//Them
const darkTheme = createTheme({
  typography: {
    fontFamily: [
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    mode: 'dark',
      primary: {
        main: "#1976d2",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#302f2f"
      },
      background: {
        default: "#08090a",
        paper: "#111214",
      },
      success: {
        light: "#81c784",
        main: "#66bb6a",
        dark: "#388e3c"
      },
      error: {
        light: "#e57373",
        main: "#f44336",
        dark: "#d32f2f"
      }
  },
});

function App() {
  //User
  const userDetailsContext = useUserDetailsContext();

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
          <UserDetailsContext.Provider value={userDetailsContext}>
            <Box className="App" sx={{
              backgroundColor: "black",
              minHeight: "100vh",
            }}>
              
              <Routes>
                  <Route path="/" element={<Layout />}>
                  <Route index element={<ProtectedRoute><DashboardGrid></DashboardGrid></ProtectedRoute>}/>
                  <Route path="/about" element={<ProtectedRoute><About/></ProtectedRoute>}/>
                  <Route path="/authenticate" element={
                    <Authenticate childrenProps={[
                      {label: "Sign In", index: 0},
                      {label: "Register", index: 1}
                    ]}>
                      <Login/>
                      <Register/>
                    </Authenticate>
                  }/>
                </Route>
              </Routes>
            </Box>
          </UserDetailsContext.Provider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
