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
    <Box>
      <Typography> About Page </Typography>
    </Box>
  );
}

export default About;
