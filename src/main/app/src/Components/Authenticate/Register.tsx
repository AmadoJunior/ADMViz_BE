//Deps
import React from "react";
import useSearchParam from "./../useQueryState";
import toast from "react-hot-toast";

//MUI
import {Box, Avatar, Typography, TextField} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//MUI LAB
import { LoadingButton } from '@mui/lab';

//Context

//Props
interface IRegisterProps {
  children?: React.ReactNode;
  authProcessing: boolean;
  setAuthProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<IRegisterProps> = ({authProcessing, setAuthProcessing}): JSX.Element => {
  const [currentForm, setCurrentForm] = useSearchParam("authForm", "0");
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const jsonData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      userName: formData.get("userName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }
    if(
      jsonData.firstName?.length && 
      jsonData.lastName?.length && 
      jsonData.userName?.length && 
      jsonData.email?.length && 
      jsonData.password?.length
    ) {
      setAuthProcessing(true);
      fetch(`/api/perform_register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
      .then(response => {
        console.log(response);
        if(response?.status === 201) {
          toast.success("Successfull Register");
          return setCurrentForm();
        }
        throw new Error("Error: " + response);
      })
      .catch(e => {
        toast.error("Failed Register");
        console.error(e);
      })
      .finally(() => {
        setAuthProcessing(false);
      })
    }
    
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
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOutlinedIcon/>
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
        />
         <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"

        />
         <TextField
          margin="normal"
          required
          fullWidth
          id="userName"
          label="User Name"
          name="userName"

        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete='new-password'
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={authProcessing}
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default Register;
