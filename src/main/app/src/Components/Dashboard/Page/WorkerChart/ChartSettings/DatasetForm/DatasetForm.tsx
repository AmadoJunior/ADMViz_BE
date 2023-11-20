//Deps
import {Fragment, useContext, useState} from "react";

//MUI
import { Box, Button } from "@mui/material";

//Interfaces

//Context
import { ChartFormContext } from "../../../../../../Context/ChartFormContext/useChartFormContext";

//Components
import CustonInput from "../../../../../Utility/CustomInput/CustomInput";

//Props
interface IDatasetFormProps {
  children?: React.ReactNode;
}

const DatasetForm: React.FC<IDatasetFormProps> = ({}): JSX.Element => {
  const formContext = useContext(ChartFormContext);
  const [title, setTitle] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  
  const [dataKey, setDataKey] = useState<string>("");

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e?.currentTarget?.value);
  }
  const handleEndpoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEndpoint(e?.currentTarget?.value);
  }
  
  const handleDataKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDataKey(e?.currentTarget?.value);
  }
  const submitDataset = () => {
    formContext.handleNewDataset({
      title,
      endpoint,
      dataKey
    });
    formContext.setExpanded(false);
  }

  return (
    <Fragment>
    {formContext?.expanded ? 
      <Box
        sx={{
          position: "relative",
          flexDirection: "column",
          display: "flex",
          width: "100%"
        }}
      >
        <CustonInput 
          title="Title"
          value={title}
          handler={handleTitle}
        ></CustonInput>
        <CustonInput 
          title="Endpoint"
          value={endpoint}
          handler={handleEndpoint}
        ></CustonInput>
        <Box sx={{
          display: "flex",
        }}>
          <CustonInput 
            title="Data Key"
            value={dataKey}
            handler={handleDataKey}
          ></CustonInput>
        </Box>
        <Button variant="contained" onClick={submitDataset}>Add</Button>
      </Box> : <Fragment></Fragment>
    }
    </Fragment>
  );
}

export default DatasetForm;
