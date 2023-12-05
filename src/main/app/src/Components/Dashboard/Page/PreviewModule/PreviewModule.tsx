//Deps
import React from "react";

//MUI
import {Box, Typography} from "@mui/material";

//Components

//Props
interface IPreviewModuleProps {
  children?: React.ReactNode;
  height: number,
  width: number,
}

const PreviewModule: React.FC<IPreviewModuleProps> = ({height, width}): JSX.Element => {
  return (
    <Box sx={{
      display: "inline-block",
      height: `${height}px`,
      width: `${width}px`,
      backgroundColor:"rgba(0, 0, 0, 0.5)",
      border: "dashed 1px",
      borderColor: "#302f2f",
      padding:"10px",
    }}>
      <Box sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "background.default",
        borderRadius: "20px",
        border: "1px solid",
        borderColor: "#302f2f",
        boxShadow: 6,
      }}>

      </Box>
    </Box>
  );
}

export default React.memo(PreviewModule);
