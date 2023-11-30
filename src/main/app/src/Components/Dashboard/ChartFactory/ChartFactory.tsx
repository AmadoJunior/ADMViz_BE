//Deps
import {useState, useContext} from "react";

//MUI
import { Box } from "@mui/material";

//Components
import CollapseForm from "../../Utility/CollapseForm/CollapseForm";

//Constants
import { COLUMN_WIDTH, MIN_HEIGHT, MIN_WIDTH, GUTTER_SIZE } from '../../../constants';
import { DefaultChartDetails } from "./DefaultChartDetails";

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

  //Form Handler
  const handleNew = () => {
    const positionObj = {
      id: 0,
      x: GUTTER_SIZE / COLUMN_WIDTH,
      y: 0,
      w: Math.floor(MIN_WIDTH / COLUMN_WIDTH),
      h: MIN_HEIGHT,
    }

    const chartPositions = dashboardContext?.charts?.map((chart) => chart?.position);

    const {updatedTop, updatedLeft} = findFreeSpace(chartPositions, positionObj, document.body.clientWidth);
    return dashboardContext.insertChart(DefaultChartDetails(inputTitle), {
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
      }, 200);
    })
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
    <CollapseForm 
      formName="Create Chart"
      inputState={{
        value: inputTitle,
        setValue: setInputTitle,
      }}
      submitHandler={handleNew}
    />
    </Box>
  );
}

export default ChartFactory;
