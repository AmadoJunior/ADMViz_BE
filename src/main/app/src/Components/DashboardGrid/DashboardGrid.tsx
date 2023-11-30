//Deps
import React from "react";
import toast from "react-hot-toast";

//MUI
import {Box, Button, Tab, Input, Typography, useTheme, Skeleton} from "@mui/material";
import { tabsClasses } from '@mui/material/Tabs';

//MUI LAB
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { LoadingButton } from '@mui/lab';

//Icons
import DeleteIcon from '@mui/icons-material/Delete';

//Context
import { UserDetailsContext } from "../../Context/UserDetailsContext/useUserDetailsContext";
import Dashboard from "../Dashboard/Dashboard";

//Custom
import CustomIconButton from "../Utility/IconButton/IconButton";
import { DASH_CONTROLS_HEIGHT, GUTTER_SIZE, NAV_HEIGHT } from "../../constants";

interface ICustomTabInput {
  label: string,
  dashboardId: number,
  tabValue: string,
  curTab: string,
  isLoading: boolean,
  onDelete: (dashboardId: number) => void,
}
function CustomTab({ label, dashboardId, tabValue, curTab, isLoading, onDelete }: ICustomTabInput) {
  return (
    <Box display="flex" alignItems="center">
      <Typography sx={{
        marginRight: "15px"
      }}>{label}</Typography>
      {
        curTab === tabValue && 
        <CustomIconButton title={`Delete Dashboard`} loading={isLoading} handler={() => onDelete(dashboardId)}>
          
            <DeleteIcon fontSize="small" sx={{
              color: "white"
            }}/>
          
        </CustomIconButton>
      }
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
  const [height, setHeight] = React.useState(0);

  //User
  const userDetailsContext = React.useContext(UserDetailsContext);

  //Dashboards
  const [dashboards, setDashboards] = React.useState<IDashboard[]>([]);

  //Tab State
  const [curTab, setCurTab] = React.useState("0");
  const [isOpen, setIsOpen] = React.useState(false);

  //Form State
  const [removalLoading, setRemoveLoading] = React.useState(false);
  const [creationLoading, setCreationLoading] = React.useState(false);
  const [newChartName, setNewChartName] = React.useState("");

  //Effect
  React.useEffect(() => {
    if(userDetailsContext?.isAuthenticated && userDetailsContext?.userDetails){
      const { id } = userDetailsContext?.userDetails;
      fetchDashboards(id);
    }
  }, [userDetailsContext?.isAuthenticated])

  React.useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      setHeight(document.documentElement.clientHeight);
    };

    // Set initial height
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //API Helpers
  const fetchDashboards = (userId: number) => {
    fetch(`/sdr/users/${userId}/dashboards`, {
      method: "GET",
    })
    .then(res => {
      if(res.status === 200){
        return res.json();
      }
      throw new Error(`Failed Fetching Dashboards: ${res.status}`);
    })
    .then(data => {
      console.log(data);
      if(data?.["_embedded"]?.["dashboards"]) {
        return setDashboards(data?.["_embedded"]?.["dashboards"]);
      }
      throw new Error(`Failed Extracting Dashboards: ${JSON.stringify(data, null, 1)}`);
    })
    .catch(e => {
      toast.error("Failed Fetching Dashboards");
      console.error(e);
    })
  }

  const handleNew = (dashboardName: string) => {
    if(userDetailsContext?.userDetails){
      setCreationLoading(true);
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
          if(res.status === 200){
            return res.json();
          }
          throw new Error(`Failed Creating Dashboard: ${res.status}`);
        })
        .then(data => {
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
            return;
          }
          throw new Error(`Failed Retrieving Created Dashboard: ${JSON.stringify(data, null, 1)}`);
        })
        .catch(e => {
          toast.error("Failed Creating Dashboard");
          console.error(e);
        })
        .finally(() => {
          setCreationLoading(false);
        })
    }
  }

  const handleRemove = (dashboardId: number) => {
    if(userDetailsContext?.userDetails){
      setRemoveLoading(true);
      fetch(`/api/dashboards/${dashboardId}`, {
        method: "DELETE",
      })
        .then(res => {
          if(res?.status === 200) {
            setDashboards(prev => prev.filter((value) => value?.id !== dashboardId));
            setCurTab("0");
            return;
          }
          throw new Error(`Failed Removing Dashboard: ${res.status}`);
        })
        .catch(e => {
          toast.error("Failed Removing Dashboard");
          console.error(e);
        })
        .finally(() => {
          setRemoveLoading(false);
        })
    }
  }

  //Event Handlers
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurTab(newValue);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewChartName(e.target.value)
  }

  return (
    <Box sx={{
      padding: "10px 10px 10px 10px"
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
                      label={
                        <CustomTab 
                          label={dashboard.name} 
                          dashboardId={dashboard.id}
                          tabValue={String(index)}
                          curTab={curTab}
                          isLoading={removalLoading}
                          onDelete={() => handleRemove(dashboard.id)} 
                        />
                      }
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
                    <Input placeholder="Dashboard Name" disabled={creationLoading} sx={{
                      width: "300px"
                    }} value={newChartName} onChange={handleInput}></Input>
                    <LoadingButton variant="outlined" size="small" loading={creationLoading} sx={{
                      marginLeft: "15px"
                    }} onClick={() => handleNew(newChartName)}>Apply</LoadingButton>
                    <Button variant="outlined" size="small" color="error" disabled={creationLoading} sx={{
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
        <>
          <Skeleton variant="rounded" sx={{
            height: `${DASH_CONTROLS_HEIGHT}px`
          }}/>
          <Skeleton variant="rounded" sx={{
            marginTop: "10px",
            height: `${height - NAV_HEIGHT + DASH_CONTROLS_HEIGHT + GUTTER_SIZE*2}px`
          }}/>
        </>
        
      }
    </Box>
  );
}

export default DashboardGrid;
