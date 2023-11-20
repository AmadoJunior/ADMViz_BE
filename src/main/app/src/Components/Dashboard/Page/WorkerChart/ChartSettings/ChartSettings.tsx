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
import { ChartFormContext } from "../../../../../Context/ChartFormContext/useChartFormContext";

//Props
import DatasetManager from "./DatasetManager/DatasetManager";

interface IChartSettingsProps {
  children?: React.ReactNode;
}

const ChartSettings: React.FC<IChartSettingsProps> = (): JSX.Element => {
  const formContext = useContext(ChartFormContext);

  return (
    <Box sx={{
      display: formContext.isActive ? "flex" : "none",
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
            value={formContext.apiKey}
            handler={formContext.handleApiKey}
        ></CustomInput>
        <CustomInput 
            title="Label Key"
            value={formContext.labelKey}
            handler={formContext.handleLabelKey}
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
            value={formContext.type}
            handler={formContext.handleType}
            options={["line", "bar", "radar", "pie", "doughnut", "polarArea"]}
          ></CustomSelect>
          <CustomSelect
            title="Method"
            value={formContext.method}
            handler={formContext.handleMethod}
            options={["GET"]}
          ></CustomSelect>
        </Box>
        
        <DatePicker filter={formContext.filter} setTo={formContext.handleTo} setFrom={formContext.handleFrom}></DatePicker>
        </Box>
        
        <Button variant="contained" onClick={formContext.onSubmit} sx={{

        }}>Apply</Button>
      </Box>
    </Box>
  );
}

export default ChartSettings;
