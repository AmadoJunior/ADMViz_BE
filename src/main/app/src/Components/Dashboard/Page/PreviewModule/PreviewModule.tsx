//Deps
import React from "react";

//MUI
import {Box, useTheme} from "@mui/material";
import { useDragDropManager } from "react-dnd";

//Components

//Props
interface IPreviewModuleProps {
  children?: React.ReactNode;
  height: number,
  width: number,
}

const getStyle = (height: number, width: number): React.CSSProperties => {
  return {
    height: `${height}px`,
    width: `${width}px`,
    borderColor: true ? "#302f2f" : "#f44336",
  }
}

const PreviewModule: React.FC<IPreviewModuleProps> = ({height, width}): JSX.Element => {
  return (
    <Box sx={{
      display: "inline-block",
      backgroundColor:"rgba(0, 0, 0, 0.5)",
      borderWidth: "1px",
      borderStyle: "dashed",
      padding:"10px",
      opacity: "0.5",
      ...getStyle(height, width)
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
