//Deps
import React from "react";
import { Outlet } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

//MUI
import { Box } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";

//Components
import Nav from "./Nav/Nav";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//Props
interface ILayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = (): JSX.Element => {
  //User
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Params
  const [searchParams, setSearchParams] = useSearchParams();

  //Errors
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const errorStateParam = searchParams.get("error");
    console.log("PARAM", errorStateParam);
    if(errorStateParam) {
      userDetailsContext.clearAuthentication();
      setOpen(true);
    } else {
      userDetailsContext.handleIsAuthenticated()
      .then(() => {
        setOpen(false);
      })
      .catch(() => {
        console.error("Unsuccessful Self Fetch");
        userDetailsContext.clearAuthentication();
      })
    }
  }, [searchParams])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      
        <Nav />
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert severity="error">Something Went Wrong!</Alert>
          </Snackbar>
          
          <Outlet context={{isAuthenticated: userDetailsContext?.isAuthenticated}}/>
          
        </Box>
      
    </Box>
  );
};

export default Layout;
