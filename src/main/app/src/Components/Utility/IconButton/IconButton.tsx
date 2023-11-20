//Deps

//MUI
import { IconButton, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

//Props
interface IIconButtonProps {
  title: string,
  handler: () => void,
  children?: React.ReactNode;
}

const CustomIconButton: React.FC<IIconButtonProps> = ({title, handler, children}): JSX.Element => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex"
      }}
    >
      <Tooltip placement="left" arrow title={title}>
        <IconButton
          onClick={handler}
          sx={[
            {
              padding: "10px",
              border: "1px solid",
              borderColor: "#302f2f",
              boxShadow: 6,
              backgroundColor: "background.paper",
            },
            () => ({
              "&:hover": {
                backgroundColor: "background.default"
              },
            }),
          ]}
        >
          {children}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default CustomIconButton;
