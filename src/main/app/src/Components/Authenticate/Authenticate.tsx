//Deps
import React from "react";

//MUI
import {Box, Avatar, Typography, TextField, FormControlLabel, Button, Checkbox, Grid} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//Components

//Props
interface IAuthenticateProps {
  children?: React.ReactNode[];
  childrenProps: {label: string, index: number}[];
}

const Authenticate: React.FC<IAuthenticateProps> = ({children, childrenProps}): JSX.Element => {
  const [currentForm, setCurrentForm] = React.useState(0);

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: "100%"
      }}
    >
      <Box sx={{
        maxWidth: "500px"
      }}>
        {children?.length && children[currentForm]}
      </Box>
      
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {childrenProps?.map((item) => {
        return (
          (currentForm === item.index ? null : <Button variant="outlined" onClick={() => {setCurrentForm(item.index)}}>{item.label}</Button>)
        )
      })}
      </Box>
      
    </Box>
  );
}

export default Authenticate;
