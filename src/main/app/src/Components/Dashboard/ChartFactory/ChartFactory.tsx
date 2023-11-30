//Deps
import {useState, useContext} from "react";

//MUI
import { Box, InputLabel, Input } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

//Components
import CustomeIconButton from "../../Utility/IconButton/IconButton";

//Constants
import { COLUMN_WIDTH, MIN_HEIGHT, MIN_WIDTH, GUTTER_SIZE } from '../../../constants';

//Context
import { DashboardContext } from "../../../Context/DashboardContext/useDashboardContext";
import { ChartType } from "../../../Context/DashboardContext/interfaces";
import { DateTime } from "luxon";

//Helpers
import { isColliding, findFreeSpace } from "../Page/Module/CollisionHelpers";

//Props
interface IChartFactoryProps {
  children?: React.ReactNode;
}

const ChartFactory: React.FC<IChartFactoryProps> = ({}): JSX.Element => {
  //Context
  const dashboardContext = useContext(DashboardContext);

  //State
  const [inputTitle, setInputTitle] = useState<string>("");
  const [creationLoading, setCreationLoading] = useState(false);

  //Form Handler
  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputTitle(e.target.value);
  }

  const handleNew = () => {
    setCreationLoading(true);

    const positionObj = {
      id: 0,
      x: GUTTER_SIZE / COLUMN_WIDTH,
      y: 0,
      w: Math.floor(MIN_WIDTH / COLUMN_WIDTH),
      h: MIN_HEIGHT,
    }

    const chartPositions = dashboardContext?.charts?.map((chart) => chart?.position);

    const collidingModule = isColliding(chartPositions, positionObj, positionObj.x, positionObj.y);
    if (!collidingModule) {
      dashboardContext.insertChart({
        name: inputTitle,
        srcUrl: "",
        dataKey: "",
        labelKey: "",
        chartType: ChartType.BAR,
        method: "GET",
        apiKey: "",
        fromDate: 0,
        toDate: DateTime.now().toMillis(),
      }, {
        x: positionObj.x,
        y: positionObj.y,
        w: positionObj.w,
        h: positionObj.h
      })
      .finally(() => {
        setCreationLoading(false);
      })
    } else {
      console.log(collidingModule);
      //const { updatedTop } = findFreeSpace(dashboardContext?.charts?.map((chart) => chart?.position), positionObj);
      const {updatedTop, updatedLeft} = findFreeSpace(chartPositions, positionObj, document.body.clientWidth);
      dashboardContext.insertChart({
        name: inputTitle,
        srcUrl: "",
        dataKey: "",
        labelKey: "",
        chartType: ChartType.BAR,
        method: "GET",
        apiKey: "",
        fromDate: 0,
        toDate: DateTime.now().toMillis(),
      }, {
        x: updatedLeft,
        y: updatedTop,
        w: positionObj.w,
        h: positionObj.h
      })
      .finally(() => {
        setTimeout(() => {
          window.scrollTo({
            top: updatedTop,
            behavior: "smooth"
          });
        }, 100);
        
        setCreationLoading(false);
      })
    }
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
    <Input
      id="chartname"
      defaultValue={inputTitle}
      placeholder="Chart Name"
      onChange={handleInputTitle}
      sx={{
        width: "300px"
      }}
    />
    </Box>
    <CustomeIconButton title={`Insert Chart`} loading={creationLoading} handler={handleNew}>
      <AddCircleOutlineIcon fontSize="small"/>
    </CustomeIconButton>
    </Box>
  );
}

export default ChartFactory;
