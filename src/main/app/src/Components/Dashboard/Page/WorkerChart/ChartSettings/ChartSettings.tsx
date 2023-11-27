//Deps
import React, {useContext} from "react";

//MUI
import {Box, Button} from "@mui/material";

//Components
import DatePicker from "./DatePicker/DatePicker";
import CustomSelect from "../../../../Utility/CustomSelect/CustomSelect";
import DatasetForm from "./DatasetForm/DatasetForm";
import CustomInput from "../../../../Utility/CustomInput/CustomInput";

//Context
import { ChartContext } from "../../../../../Context/ChartContext/useChartContext";

//Props
import DatasetManager from "./DatasetManager/DatasetManager";

interface IChartSettingsProps {
  children?: React.ReactNode;
}

const ChartSettings: React.FC<IChartSettingsProps> = (): JSX.Element => {
  const chartContext = useContext(ChartContext);

  return (
    <Box sx={{
      display: chartContext.isActive ? "flex" : "none",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      borderRadius: "20px",
      zIndex: 2
    }}>
    
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        border: "solid 1px",
        borderColor: "secondary.main",
        boxShadow: 6,
        padding: "20px 20px 20px 20px",
        overflowY: "scroll",
        backgroundColor: "background.paper",
        justifyContent: "space-between"
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column"
        }}>
        <DatasetManager>
          <DatasetForm></DatasetForm>
        </DatasetManager>
        <CustomInput 
            title="API Key"
            value={chartContext.apiKey}
            handler={chartContext.handleApiKey}
        ></CustomInput>
        <CustomInput 
            title="Label Key"
            value={chartContext.labelKey}
            handler={chartContext.handleLabelKey}
        ></CustomInput>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: "20px"
        }}>
          <CustomSelect
            title="ChartType"
            value={chartContext.type}
            handler={chartContext.handleType}
            options={["line", "bar", "radar", "pie", "doughnut", "polarArea"]}
          ></CustomSelect>
          <CustomSelect
            title="Method"
            value={chartContext.method}
            handler={chartContext.handleMethod}
            options={["GET"]}
          ></CustomSelect>
        </Box>
        
        <DatePicker filter={chartContext.filter} setTo={chartContext.setTo} setFrom={chartContext.setFrom}></DatePicker>
        </Box>
        
        <Button variant="contained" onClick={chartContext.onSubmit} sx={{

        }}>Apply</Button>
      </Box>
    </Box>
  );
}

export default ChartSettings;
