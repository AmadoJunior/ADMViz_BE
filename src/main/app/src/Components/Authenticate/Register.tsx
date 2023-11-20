//Deps
import React from "react";
import { useNavigate } from 'react-router-dom';

//MUI
import {Box, Avatar, Typography, TextField, FormControlLabel, Button, Checkbox, Grid} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//Components

//Props
interface IRegisterProps {
  children?: React.ReactNode;
}

const Register: React.FC<IRegisterProps> = (props): JSX.Element => {
  const navigate = useNavigate();
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = ({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      userName: data.get("userName"),
      email: data.get('email'),
      password: data.get('password'),
    });
    console.log(requestData)
    const basePath = "http://localhost:8080";
    fetch(`${basePath}/api/perform_register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      console.log(response);
      if(response?.redirected) navigate(response?.url?.split(basePath)?.[1] || "/");
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
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="firstName"
        />
         <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="lastName"
        />
         <TextField
          margin="normal"
          required
          fullWidth
          id="userName"
          label="User Name"
          name="userName"
          autoComplete="userName"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default Register;
