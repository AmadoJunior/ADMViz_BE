//Deps
import React from "react";
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//MUI
import {Box, Avatar, Typography, TextField, FormControlLabel, Button, Checkbox, Grid} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";
import { IUserDetails } from "../../Context/UserDetailsContext/interfaces";

//Components

//Props
interface ILoginProps {
  children?: React.ReactNode;
}

const Login: React.FC<ILoginProps> = (props): JSX.Element => {
  //Error
  const navigate = useNavigate();

  //User Details
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Methods
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });

    const basePath = "http://localhost:8080";
    fetch(`${basePath}/api/perform_login`, {
      method: "POST",
      body: data,
      redirect: "follow"
    })
    .then(response => {
      console.log(response);
      const path = response?.url?.split(basePath)?.[1];
      console.log(path);
      //if(response?.redirected) navigate(path || "/");
    })
    .catch(e => {
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
