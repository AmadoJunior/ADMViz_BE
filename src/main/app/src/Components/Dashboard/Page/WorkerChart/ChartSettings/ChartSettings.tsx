//Deps
import React, {useContext} from "react";
import { ChartType } from "../../../../../Context/DashboardContext/interfaces";
import { DateTime } from "luxon";

//MUI
import {Box, Button} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

//Components
import DatePicker from "./DatePicker/DatePicker";
import CustomSelect from "../../../../Utility/CustomSelect/CustomSelect";
import CustomInput from "../../../../Utility/CustomInput/CustomInput";

//Context
import { DashboardContext } from "../../../../../Context/DashboardContext/useDashboardContext";

//Props
interface IChartSettingsProps {
  children?: React.ReactNode;
  chartId: number,
  isActive: boolean,
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChartSettings: React.FC<IChartSettingsProps> = ({chartId, isActive, setIsActive}): JSX.Element => {
  //Context
  const dashboardContext = useContext(DashboardContext);

  //State
  const [name, setName] = React.useState<string>("");
  const [srcUrl, setSrcUrl] = React.useState<string>("");
  const [dataKey, setDataKey] = React.useState<string>("");
  const [apiKey, setApiKey] = React.useState("");
  const [labelKey, setLabelKey] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("GET");
  const [chartType, setChartType] = React.useState<string>(ChartType.LINE);
  const [from, setFrom] = React.useState<number>(
    DateTime.now().minus({ months: 1 }).toMillis()
  );
  const [to, setTo] = React.useState<number>(
    DateTime.now().plus({ days: 1 }).toMillis()
  );

  //Form Handlers
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e?.currentTarget?.value);
  }

  const handleSrcUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSrcUrl(e?.currentTarget?.value);
  }
  
  const handleDataKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDataKey(e?.currentTarget?.value);
  }

  const handleLabelKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLabelKey(e?.currentTarget?.value);
  };

  const handleApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setApiKey(e?.currentTarget?.value);
  };

  const handleMethod = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setMethod(e.target.value);
  };

  const handleType = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setChartType(e.target.value);
  };

  const onSubmit = () => {
    setIsActive(false);
    dashboardContext.updateChartDetails(chartId, {
      name,
      srcUrl,
      dataKey,
      labelKey,
      chartType,
      method,
      apiKey,
      filter: {
        from,
        to
      }
    })
  };

  return (
    <Box sx={{
      display: isActive ? "flex" : "none",
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
        <CustomInput 
            title="Chart Name"
            value={name}
            handler={handleName}
        ></CustomInput>
        <CustomInput 
            title="Src Url"
            value={srcUrl}
            handler={handleSrcUrl}
        ></CustomInput>
        <CustomInput 
            title="Data Key"
            value={dataKey}
            handler={handleDataKey}
        ></CustomInput>
        <CustomInput 
            title="API Key"
            value={apiKey}
            handler={handleApiKey}
        ></CustomInput>
        <CustomInput 
            title="Label Key"
            value={labelKey}
            handler={handleLabelKey}
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
            value={chartType}
            handler={handleType}
            options={["line", "bar", "radar", "pie", "doughnut", "polarArea"]}
          ></CustomSelect>
          <CustomSelect
            title="Method"
            value={method}
            handler={handleMethod}
            options={["GET"]}
          ></CustomSelect>
        </Box>
        
        <DatePicker filter={{
          from,
          to,
        }} setTo={setTo} setFrom={setFrom}></DatePicker>
        </Box>
        
        <Button variant="contained" onClick={onSubmit} sx={{

        }}>Apply</Button>
      </Box>
    </Box>
  );
}

export default ChartSettings;
