//Deps
import React from "react";
import { Formik, Field, Form, FormikHelpers } from 'formik';

//MUI
import {Box, Avatar, Typography, TextField, FormControlLabel, Button, Checkbox, Grid} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";

//Components

//Props
interface ILoginProps {
  children?: React.ReactNode;
}

const Login: React.FC<ILoginProps> = (props): JSX.Element => {
  //User Details
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Methods
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    userDetailsContext.handleErrored(false);
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    }
    console.log(data);

    const basePath = "http://localhost:8080";
    fetch(`${basePath}/api/perform_login`, {
      method: "POST",
      body: formData,
    })
    .then(response => {
      console.log(response);
      if(response.status === 200){
        return userDetailsContext.handleIsAuthenticated();
      }
      userDetailsContext.handleErrored(true);
    })
    .catch(e => {
      userDetailsContext.handleErrored(true);
      console.error(e);
    })
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon color="primary"/>
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="User Name"
          name="username"
          autoComplete="username"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
