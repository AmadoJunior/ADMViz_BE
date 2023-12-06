//Deps
import React, { useContext, useEffect, useState } from 'react';
import { getEmptyImage } from "react-dnd-html5-backend";
import { Box, useTheme } from '@mui/material';
import { useDrag, useDragDropManager } from 'react-dnd';
import { useRafLoop } from 'react-use';
import {useUpdate} from 'react-use';
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
import { snapToGrid, getCollidingModule, findNearestFreePosition, isColliding } from './CollisionHelpers';
import { COLUMN_WIDTH, GUTTER_SIZE, MIN_HEIGHT, MIN_WIDTH } from '../../../../constants';

//Props
type ModuleProps = {
  chartId: number,
  position: IChartPosition;
  children?: React.ReactNode;
  parentEl: React.MutableRefObject<HTMLInputElement>;
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
  }
}

const Module: React.FC<ModuleProps> = ({chartId, position, children, parentEl}) => {
  const theme = useTheme();

  //Dash Context
  const {charts, updateChartPosition, removeChart} = React.useContext(DashboardContext);

  //Ref
  const moduleRef = React.useRef<HTMLDivElement>(null);

  //Props Destruct
  const { id, h, w } = position;

  //Local Vars
  const initialPosition = React.useRef<{ top: number; left: number }>();
  const [x, setX] = React.useState(position.x);
  const [y, setY] = React.useState(position.y);

  //State
  const [removalLoading, setRemovalLoading] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeError, setResizeError] = React.useState(false);
  
  
  //DnD Manager
  const dndManager = useDragDropManager();

  //Local State
  const moveChart = React.useCallback(
    (newLeft: number, newTop: number) => {
      setY(Math.max(newTop, GUTTER_SIZE));
      setX(Math.max(newLeft, GUTTER_SIZE));
    },
    [x, y, setX, setY, parentEl?.current],
  );

  //Drag Handlers
  const handleDrag = React.useCallback(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();
    const currentChart = dndManager.getMonitor().getItem();

    if (!initialPosition.current || !movement) {
      return;
    }
  
    let left = Math.round(initialPosition.current.left + movement.x);
    let top = Math.round(initialPosition.current.top + movement.y);

    const [newLeft, newTop] = snapToGrid(left, top, COLUMN_WIDTH);
  
    const collidingChart = getCollidingModule(charts, currentChart, newLeft, newTop);
    if (!collidingChart) {
      moveChart(newLeft, newTop);
    } else {
      
      const { updatedLeft, updatedTop } = findNearestFreePosition(currentChart, collidingChart, newLeft, newTop);
      
      const updatedCollidingChart = getCollidingModule(charts, currentChart, updatedLeft, updatedTop);
      
      if (!updatedCollidingChart && updatedLeft >= 0 && updatedTop >= 0) {
        moveChart(updatedLeft, updatedTop);
      } else {
        
      }
    }
  }, [dndManager, w, h, x, y])

  //Drag Raf
  const [stopDrag, startDrag] = useRafLoop(handleDrag, false);

  const onDragStart = React.useCallback(() => {
    // Track the Initial Position
    initialPosition.current = { top: y, left: x };

    // Start RAF
    startDrag();

    return { 
      chartId,
      position,
    };
  }, [chartId, id, w, h, x, y]);

  const onDragStop = React.useCallback(() => {
    // Stop RAF
    stopDrag();
    
    updateChartPosition(chartId, {
      id,
      x,
      y,
      h,
      w
    })
  }, [updateChartPosition, chartId, id, x, y, h, w]);


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
  const [resizeStart, resizeStop] = useRafLoop(() => {});
  const handleResize = React.useCallback((e: MouseEvent | TouchEvent, direction: Direction, ref: HTMLElement, d: NumberSize) => {
    // Calculate New Values
    const tentativeW = w + d.width;
    const tentativeH = h + d.height;

    const collidingChart = isColliding(charts, id, tentativeW, tentativeH, x, y);

    if(!collidingChart){
      setResizeError(false);
    } else {
      setResizeError(true);
    }
  }, [charts, id, x, y, w, h]);

  const onResizeStop = React.useCallback((
    e: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    d: NumberSize
  ) => {
    console.log("Resize Stopped");
    const tentativeW = w + d.width;
    const tentativeH = h + d.height;

    const collidingChart = isColliding(charts, id, tentativeW, tentativeH, x, y);

    if(!collidingChart){
      updateChartPosition(chartId, {
        id,
        x,
        y,
        h: tentativeH,
        w: tentativeW,
      })
    }
    
    //Resizing State
    setIsResizing(false);
    setResizeError(false);
    
    //Stop Raf
    resizeStop();
  }, [updateChartPosition, chartId, id, y, x, h, w]);

  const onResizeStart = React.useCallback((e: any, direction: Direction) => {
    console.log("Resize Started");
    //Start Raf
    resizeStart();

    //Resizing State
    setIsResizing(true);
  }, [setIsResizing]);

  //Delete
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
            borderColor: `${isResizing ? resizeError ? theme.palette.error.main : theme.palette.primary.main : "#302f2f"}`,
            borderWidth: "1px",
          }}
          size={{
            width: w,
            height: h,
          }}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          onResize={handleResize}
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
