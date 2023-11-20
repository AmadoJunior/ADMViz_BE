//Deps
import React from "react";
import useSearchParam from "./../useQueryState";

//MUI
import {Box, Avatar, Typography, TextField, FormControlLabel, Button, Checkbox, Grid} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";

//Props
interface IRegisterProps {
  children?: React.ReactNode;
}

const Register: React.FC<IRegisterProps> = (props): JSX.Element => {
  const userDetailsContext = React.useContext(UserDetailsContext);
  const [currentForm, setCurrentForm] = useSearchParam("authForm", "0");
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    userDetailsContext.handleErrored(false);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      userName: formData.get("userName"),
      email: formData.get("email"),
      password: formData.get("password"),
    }
    console.log(data);
    const basePath = "http://localhost:8080";
    fetch(`${basePath}/api/perform_register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      console.log(response);
      if(response?.status !== 201) throw new Error("Error: " + response);
      userDetailsContext.handleErrored(false);
      setCurrentForm();
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
