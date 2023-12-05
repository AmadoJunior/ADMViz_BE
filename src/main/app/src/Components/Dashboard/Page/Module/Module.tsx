//Deps
import React, { useContext, useEffect, useState } from 'react';
import { getEmptyImage } from "react-dnd-html5-backend";
import { Box, useTheme } from '@mui/material';
import { useDrag, useDragDropManager } from 'react-dnd';
import { useRafLoop } from 'react-use';
import { Resizable } from 're-resizable';
import { NumberSize } from "re-resizable";
import { Direction } from "re-resizable/lib/resizer";
import DeleteIcon from '@mui/icons-material/Delete';

//MUI LAB
import { LoadingButton } from '@mui/lab';

//Context
import { DashboardContext } from '../../../../Context/DashboardContext/useDashboardContext';

//Interfaces && Types
import { IChartPosition } from '../../../../Context/DashboardContext/interfaces';

//Constants && Helpers
import { COLUMN_WIDTH, GUTTER_SIZE, MIN_HEIGHT, MIN_WIDTH } from '../../../../constants';

//Props
type ModuleProps = {
  chartId: number,
  position: IChartPosition;
  children?: React.ReactNode
};

function getPositionStyles(
  left: number,
  top: number,
  isDragging: boolean,
): React.CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  }
}

const Module: React.FC<ModuleProps> = ({chartId, position, children}) => {
  const theme = useTheme();

  //Window Context
  const {updateChartPosition, removeChart} = React.useContext(DashboardContext);

  //Ref
  const moduleRef = React.useRef<HTMLDivElement>(null);

  //Props Destruct
  const { id, w, h, x, y } = position;

  //State
  const [removalLoading, setRemovalLoading] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);

  //Drag Handlers
  const onDragStart = React.useCallback(() => {
    return { 
      chartId,
      position,
    };
  }, [chartId, id, w, h, x, y]);

  const onDragStop = () => {};

  // Wire the Module to DnD Drag System
  const [{isDragging}, drag, preview] = useDrag(() => ({
    type: 'module',
    item: onDragStart,
    end: onDragStop,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, y, x, h, w]);

  //Disable Preview
  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [])
  
  //Resize Handlers
  const onResizeStop = React.useCallback((
    e: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    d: NumberSize
  ) => {
    console.log("Resize Stopped");

    // Calculate tentative new width and height
    const tentativeW = w + d.width;
    const tentativeH = h + d.height;

    updateChartPosition(chartId, {
      id,
      w: tentativeW,
      h: tentativeH,
      y: y,
      x: x,
    });
    setIsResizing(false);
  }, [updateChartPosition, chartId, id, y, x, h, w]);

  const onResizeStart = React.useCallback((e: any, direction: Direction) => {
    console.log("Resize Started");
    setIsResizing(true);
  }, [setIsResizing]);

  const handleChartRemoval = React.useCallback((chartId: number) => {
    setRemovalLoading(true);
    removeChart(chartId)
    .finally(() => {
      setRemovalLoading(false);
    })
  }, [removeChart, setRemovalLoading, chartId]);

  //Render
  return (
      <Box
        ref={moduleRef}
        display="flex"
        position="absolute"
        top="0px"
        left="0px"
        sx={
          getPositionStyles(x, y, isDragging)
        }
      >
        <Resizable
          boundsByDirection={true}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          grid={[COLUMN_WIDTH, COLUMN_WIDTH]}
          style={{
            padding:"10px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            backgroundColor:"rgba(0, 0, 0, 0.5)",
            borderStyle: "dashed",
            borderColor: `${isResizing ? theme.palette.primary.main : "#302f2f"}`,
            borderWidth: "1px",
          }}
          size={{
            width: w,
            height: h,
          }}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
        >
        <Box
          ref={drag}
          height="100%"
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          sx={{ 
            position: "relative",
            cursor: 'move', 
            width: "100%",
          }}
          draggable
        >
          <LoadingButton variant='contained' color="error" loading={removalLoading}  sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 5,
          }}
            onClick={() => handleChartRemoval(chartId)}
          >
            <DeleteIcon/>
          </LoadingButton>
          {children}
        </Box>
        </Resizable>
      </Box>
  );
};

export default React.memo(Module);
