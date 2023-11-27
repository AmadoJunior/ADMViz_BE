//Deps
import React from "react";

//MUI
import {Box, Typography, Tab, Button, Input} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";
import Dashboard from "../Dashboard/Dashboard";

//Props
interface IDashboard {
  id: number,
  name: string,
}

interface IDashboardGridProps {
  children?: React.ReactNode;
}

const DashboardGrid: React.FC<IDashboardGridProps> = (props): JSX.Element => {
  //User
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Dashboards
  const [dashboards, setDashboards] = React.useState<IDashboard[]>([]);

  //Tab State
  const [curTab, setCurTab] = React.useState("0");
  const [isOpen, setIsOpen] = React.useState(false);

  //Form State
  const [newChartName, setNewChartName] = React.useState("");

  React.useEffect(() => {
    if(userDetailsContext?.isAuthenticated && userDetailsContext?.userDetails){
      const { id } = userDetailsContext?.userDetails;
      fetch(`/api/users/${id}/dashboards`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {
        console.log(data);
        if(data?.["_embedded"]?.["dashboards"]) {
          setDashboards(data?.["_embedded"]?.["dashboards"]);
        }
      })
      .catch(e => {
        console.error(e);
      })
    }
    
  }, [userDetailsContext?.isAuthenticated])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurTab(newValue);
  };

  const handleNew = (dashboardName: string) => {
    if(userDetailsContext?.userDetails){
      fetch(`/api/dashboards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dashboardName
        })
      })
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => {
          console.log(data);
          if(data) {
            setDashboards(prev => [
              ...prev, 
              {
                id: data?.id,
                name: data?.name,
              }
            ]);
            setIsOpen(false);
            setNewChartName("");
          }
        })
        .catch(e => {
          console.error(e);
        })
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewChartName(e.target.value)
  }

  return (
    <Box >
      {
        dashboards?.length && 
        <TabContext value={curTab}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {
                dashboards?.map((dashboard, index) => {
                  return (
                    <Tab label={dashboard?.name} value={String(index)} />
                  )
                })
              }
            </TabList>
              <Box sx={{
                paddingX: "10px"
              }}>
                {
                  isOpen ? (
                    <>
                    <Input sx={{
                      width: "300px"
                    }} value={newChartName} onChange={handleInput}></Input>
                    <Button variant="outlined" sx={{
                      marginX: "10px"
                    }} onClick={() => handleNew(newChartName)}>Apply</Button>
                    </>
                  ) : (
                  <Button variant="outlined" onClick={() => setIsOpen(prev => !prev)}>Add</Button>
                  )
                }
              </Box>
          </Box>
          {
            dashboards?.map((dashboard, index) => {
              return (
                <TabPanel sx={{
                  padding: "0px"
                }} value={String(index)}><Dashboard title={dashboard.name} id={dashboard.id}></Dashboard></TabPanel>
              )
            })
          }
        </TabContext>
      }
    </Box>
  );
}

export default DashboardGrid;
