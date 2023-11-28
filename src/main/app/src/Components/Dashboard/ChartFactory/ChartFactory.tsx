//Deps
import {useState, useContext} from "react";

//MUI
import { Box, InputLabel, Input } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

//Components
import CustomeIconButton from "../../Utility/IconButton/IconButton";

//Constants
import { COLUMN_WIDTH, MIN_HEIGHT, MIN_WIDTH } from '../../../constants';

//Context
import { DashboardContext } from "../../../Context/DashboardContext/useDashboardContext";
import { ChartType } from "../../../Context/DashboardContext/interfaces";
import { DateTime } from "luxon";

//Props
interface IChartFactoryProps {
  children?: React.ReactNode;
}

const ChartFactory: React.FC<IChartFactoryProps> = ({}): JSX.Element => {
  //Context
  const dashboardContext = useContext(DashboardContext);

  //State
  const [inputTitle, setInputTitle] = useState<string>("");

  //Form Handler
  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputTitle(e.target.value);
  }

  const handleNew = () => {
    dashboardContext.insertChart({
      name: inputTitle,
      srcUrl: "",
      dataKey: "",
      labelKey: "",
      type: ChartType.BAR,
      method: "GET",
      apiKey: "",
      filter: {
        from: 0,
        to: DateTime.now().toMillis(),
      },
    });
  }

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingRight: "20px"
    }}>
    <InputLabel htmlFor="chartname" sx={{
      width: "160px"
    }}>New Chart</InputLabel>
    <Input
      id="chartname"
      defaultValue={inputTitle}
      onChange={handleInputTitle}
      sx={{
        textAlign: "center",
        width: "100%",
      }}
    />
    </Box>
    <CustomeIconButton title={`Insert Chart`} handler={handleNew}>
      <AddCircleOutlineIcon/>
    </CustomeIconButton>
    </Box>
  );
}

export default ChartFactory;
