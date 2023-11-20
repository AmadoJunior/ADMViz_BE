//Deps
import React from "react";
import { DatePicker as XDatePicker } from '@mui/x-date-pickers/DatePicker';
import {DateTime} from "luxon";

//MUI
import {Box} from "@mui/material";

//Components

//Props
import { IDateFilter } from "../../../../../../Context/ChartFormContext/interfaces";
interface IDatePickerProps {
  filter: IDateFilter,
  setFrom: (n: number) => void,
  setTo: (n: number) => void,
  children?: React.ReactNode;
}

const DatePicker: React.FC<IDatePickerProps> = ({filter, setFrom, setTo}): JSX.Element => {
  const handleFrom = (dt: DateTime) => {
    setFrom(dt.toMillis());
  }
  const handleTo = (dt: DateTime) => {
    setTo(dt.toMillis());
  }
  
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      marginBottom: "20px",
    }}>
      <XDatePicker label="From" onChange={(newValue) => handleFrom(newValue as DateTime)} defaultValue={DateTime.fromMillis(filter.from)} sx={{
        paddingRight: "20px"
      }}/>
      <XDatePicker label="To" onChange={(newValue) => handleTo(newValue as DateTime)} defaultValue={DateTime.fromMillis(filter.to)}/>
    </Box>
  );
}

export default DatePicker;
