//Deps
import {useState, useContext} from "react";
import { v4 } from 'uuid';

//MUI
import { Box, InputLabel, Input } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

//Components
import CustomeIconButton from "../../Utility/IconButton/IconButton";

//Constants
import { COLUMN_WIDTH, MIN_HEIGHT, MIN_WIDTH } from '../../../constants';

//Context
import { ScreenContext } from "../../../Context/ScreenContext/useScreenContext";
import { ModuleContext } from "../../../Context/ModuleContext/useModuleContext";

//Props
interface IChartFactoryProps {
  children?: React.ReactNode;
}

const ChartFactory: React.FC<IChartFactoryProps> = ({}): JSX.Element => {
  //Context
  const screenContext = useContext(ScreenContext);
  
  const moduleContext = useContext(ModuleContext);
  //State
  const [inputTitle, setInputTitle] = useState<string>("");

  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputTitle(e.target.value);
  }

  const handleNew = () => {
    for(let curModule of moduleContext.modules){
      if(curModule.title === inputTitle) return;
    }
    moduleContext.addModule({
      id: v4(),
      title: inputTitle,
      coord: {
        x: 0,
        y: 0,
        w: Math.floor(MIN_WIDTH/COLUMN_WIDTH),
        h: MIN_HEIGHT
      }
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
      width: "100%"
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
    <CustomeIconButton title={`NEW`} handler={handleNew}>
      <AddCircleOutlineIcon/>
    </CustomeIconButton>
    </Box>
  );
}

export default ChartFactory;
