//Deps
import React from "react";

//MUI
import {Box, Typography} from "@mui/material";

//Components

//Props
interface IAboutProps {
  children?: React.ReactNode;
}

const About: React.FC<IAboutProps> = (props): JSX.Element => {
  return (
    <Box sx={{
      backgroundColor: "background.paper",
      margin: "10px",
      borderRadius: "10px",
      height: "100%",
      width: "100%",
      padding: "20px"
    }}>
      <Typography variant="h6" gutterBottom> About Page </Typography>
      <Typography gutterBottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
    </Box>
  );
}

export default React.memo(About);
