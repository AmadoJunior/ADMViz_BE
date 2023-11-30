//Deps
import React, { ReactElement } from "react";
import useSearchParam from "../useQueryState";

//MUI
import {Box, Button} from "@mui/material";
import { LoadingButton } from '@mui/lab';

//Components

//Props
interface IAuthenticateProps {
  children?: React.ReactNode[];
  childrenProps: {label: string, index: number}[];
}

const Authenticate: React.FC<IAuthenticateProps> = ({children, childrenProps}): JSX.Element => {
  const [currentForm, setCurrentForm] = useSearchParam("authForm", "0");
  const [authProcessing, setAuthProcessing] = React.useState(false);

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: "100%"
      }}
    >
      <Box sx={{
        maxWidth: "500px"
      }}>
        {children?.length && React.isValidElement(children[parseInt(currentForm)]) && React.cloneElement(children[parseInt(currentForm)] as ReactElement, {
          authProcessing,
          setAuthProcessing,
        })}
      </Box>
      
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {childrenProps?.map((item) => {
        return (
          (parseInt(currentForm) === item.index ? null : <LoadingButton key={`${item.label}${String(item.index)}`} variant="outlined" loading={authProcessing} onClick={() => {setCurrentForm(String(item.index))}}>{item.label}</LoadingButton>)
        )
      })}
      </Box>
      
    </Box>
  );
}

export default Authenticate;
