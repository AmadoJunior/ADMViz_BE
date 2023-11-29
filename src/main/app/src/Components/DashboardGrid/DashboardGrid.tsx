//Deps
import React from "react";

//MUI
import {Box, IconButton, Button, Tab, Input, Typography, useTheme} from "@mui/material";
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeleteIcon from '@mui/icons-material/Delete';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";
import Dashboard from "../Dashboard/Dashboard";

//Custom
import CustomIconButton from "../Utility/IconButton/IconButton";

interface ICustomTabInput {
  label: string,
  dashboardId: number,
  onDelete: (dashboardId: number) => void,
}
function CustomTab({ label, dashboardId, onDelete }: ICustomTabInput) {
  return (
    <Box display="flex" alignItems="center">
      <Typography sx={{
        marginRight: "15px"
      }}>{label}</Typography>
      <CustomIconButton title={`Delete Dashboard`} handler={() => onDelete(dashboardId)}>
        <DeleteIcon fontSize="small"/>
      </CustomIconButton>
    </Box>
  );
}

//Props
interface IDashboard {
  id: number,
  name: string,
}

interface IDashboardGridProps {
  children?: React.ReactNode;
}

const DashboardGrid: React.FC<IDashboardGridProps> = (props): JSX.Element => {
  //Theme
  const theme = useTheme();

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
      fetch(`/sdr/users/${id}/dashboards`, {
        method: "GET",
      })
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

  const handleRemove = (dashboardId: number) => {
    if(userDetailsContext?.userDetails){
      fetch(`/api/dashboards/${dashboardId}`, {
        method: "DELETE",
      })
        .then(res => {
          console.log(res);
          if(res?.status === 200) {
            setDashboards(prev => prev.filter((value) => value?.id !== dashboardId));
            setCurTab("0");
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
    <Box sx={{
      
    }}>
      {
        dashboards?.length ?
        <TabContext value={curTab}>
          <Box sx={{ 
            borderWidth: "1px", 
            borderColor: 'divider',
            borderRadius: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: `${theme.palette.background.paper} !important`,
            margin: "10px 10px 0px 10px"
          }}>
            <TabList 
              onChange={handleChange} 
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              sx={{
                [`& .${tabsClasses.scrollButtons}`]: {
                  '&.Mui-disabled': { opacity: 0.3 },
                },
              }}
            >
              {
                dashboards?.map((dashboard, index) => {
                  return (
                    <Tab
                      key={`TabList:${dashboard.name}${index}`}
                      label={<CustomTab label={dashboard.name} dashboardId={dashboard.id} onDelete={() => handleRemove(dashboard.id)} />}
                      value={String(index)}
                    />
                  )
                })
              }
            </TabList>
              <Box sx={{
                paddingX: "10px"
              }}>
                {
                  isOpen ? (
                    <Box sx={{
                      display: "flex"
                    }}>
                    <Input placeholder="Dashboard Name" sx={{
                      width: "300px"
                    }} value={newChartName} onChange={handleInput}></Input>
                    <Button variant="outlined" size="small" sx={{
                      marginLeft: "15px"
                    }} onClick={() => handleNew(newChartName)}>Apply</Button>
                    <Button variant="outlined" size="small" color="error" sx={{
                      marginLeft: "10px"
                    }} onClick={() => setIsOpen(false)}>Cancel</Button>
                    </Box>
                  ) : (
                  <Button variant="outlined" size="small" onClick={() => setIsOpen(prev => !prev)}>New Dashboard</Button>
                  )
                }
              </Box>
          </Box>
          {
            userDetailsContext?.isAuthenticated && dashboards?.map((dashboard, index) => {
              return (
                <TabPanel 
                  key={`TabPanels:${dashboard.name}${index}`} 
                  sx={{
                    padding: "0px"
                  }} 
                  value={String(index)}>
                    <Dashboard 
                      userId={userDetailsContext?.userDetails ? userDetailsContext.userDetails.id : 0} 
                      dashboardName={dashboard.name} 
                      dashboardId={dashboard.id}/>
                </TabPanel>
              )
            })
          }
        </TabContext>
        :
        null
      }
    </Box>
  );
}

export default DashboardGrid;
