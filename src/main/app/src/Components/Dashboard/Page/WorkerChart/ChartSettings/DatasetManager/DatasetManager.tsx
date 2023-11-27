//Deps
import React, { useContext } from "react";

//MUI
import { Box, Button, Typography, IconButton } from "@mui/material";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";
import ClearIcon from "@mui/icons-material/Clear";

//Context
import { ChartContext } from "../../../../../../Context/ChartContext/useChartContext";

//Components

//Props
interface IDatasetManagerProps {
  children?: React.ReactNode;
}

const DatasetManager: React.FC<IDatasetManagerProps> = ({
  children,
}): JSX.Element => {
  const formContext = useContext(ChartContext);

  //State
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "0px 0px 10px 0px",
      }}
    >
      <Typography gutterBottom>Datasets</Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          {formContext?.datasets?.length ? (
            formContext.datasets.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={[
                    {
                      position: "relative",
                      display: "flex",
                      backgroundColor: "background.default",
                      padding: "10px",
                      borderRadius: "10px",
                      clipPath: "inset( -100vw 0 -100vw -100vw )",
                      maxWidth: "44px",
                      maxHeight: "44px",
                      marginRight: "5px",
                      transition: "max-width 0.1s",
                    },
                    () => ({
                      "&:hover": {
                        maxWidth: "500px",
                      },
                    }),
                  ]}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: "-10px",
                      top: "-10px",
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        formContext.handleDeleteDataset(item.title)
                      }
                      sx={[
                        {
                          padding: "4px",
                          border: "1px solid",
                          borderColor: "#302f2f",
                          boxShadow: 6,
                          backgroundColor: "background.default",
                        },
                        () => ({
                          "&:hover": {
                            backgroundColor: "background.paper",
                          },
                        }),
                      ]}
                    >
                      <ClearIcon
                        sx={{
                          height: "16px",
                          width: "16px",
                        }}
                      ></ClearIcon>
                    </IconButton>
                  </Box>

                  <DatasetLinkedIcon sx={{}}></DatasetLinkedIcon>
                  <Typography
                    sx={{
                      marginLeft: "10px",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography>No Datasets</Typography>
          )}
        </Box>
        {expanded ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => setExpanded(false)}
          >
            Close
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setExpanded(true)}
          >
            Add
          </Button>
        )}
      </Box>
      {expanded ? children : null}
    </Box>
  );
};

export default DatasetManager;
