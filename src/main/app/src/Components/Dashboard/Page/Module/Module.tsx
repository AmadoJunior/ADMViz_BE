//Deps
import React, { useContext, useEffect, useState } from 'react';
import { getEmptyImage } from "react-dnd-html5-backend";
import { Box, Button } from '@mui/material';
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
import { COLUMN_WIDTH, GUTTER_SIZE, MIN_HEIGHT, MIN_WIDTH, moduleW2LocalWidth, moduleX2LocalX, moduleY2LocalY } from '../../../../constants';
import {isColliding, findNearestFreePosition} from "./CollisionHelpers";

//Props
type ModuleProps = {
  chartId: number,
  position: IChartPosition;
  children?: React.ReactNode
};

const Module: React.FC<ModuleProps> = ({chartId, position, children}) => {
  //Window Context
  const dashboardContext = React.useContext(DashboardContext);

  //Ref
  const moduleRef = React.useRef<HTMLDivElement>(null);

  //Props Destruct
  const { id } = position;

  //State
  const [w, setW] = useState(position.w);
  const [h, setH] = useState(position.h);
  const [x, setX] = useState(position.x);
  const [y, setY] = useState(position.y);
  const initialPosition = React.useRef<{ top: number; left: number }>();
  const [removalLoading, setRemovalLoading] = React.useState(false);

  //DnD Manager
  const dndManager = useDragDropManager();

  //Methods
  const updatePosition = (left: number, top: number) => {
    setY(top);
    setX(Math.floor((left / COLUMN_WIDTH)));
  };

  const updateSize = (width: number, height: number) => {
    setH(height);
    setW(width);
  };

  const handleDrag = () => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();
  
    if (!initialPosition.current || !movement) {
      return;
    }
  
    let newTop = Math.max(0, initialPosition.current.top + movement.y - GUTTER_SIZE);
    let newLeft = Math.max(
      GUTTER_SIZE,
      Math.min(
        initialPosition.current.left + Math.floor(movement.x / COLUMN_WIDTH) * COLUMN_WIDTH,
        document.documentElement.clientWidth - (GUTTER_SIZE*3) - w * COLUMN_WIDTH,
      ),
    );
    const chartPositions = dashboardContext?.charts?.map((chart) => chart?.position);
    const collidingModule = isColliding(chartPositions, position, newLeft, newTop);
    if (!collidingModule) {
      updatePosition(newLeft, newTop);
    } else {
      
      const { updatedLeft, updatedTop } = findNearestFreePosition(position, collidingModule, newLeft, newTop);
  
      const clampedTop = Math.max(0, updatedTop);
      const clampedLeft = Math.max(GUTTER_SIZE, Math.min(updatedLeft, document.documentElement.clientWidth - w * COLUMN_WIDTH));
      
      const updatedCollidingModule = isColliding(chartPositions, position, clampedLeft, clampedTop);
      
      if (!updatedCollidingModule) {
        updatePosition(clampedLeft, clampedTop);
      }
    }
  };

  //Raf Loop
  const [stop, start] = useRafLoop(handleDrag, false);

  const onDragStart = () => {
    // Track the Initial Position
    initialPosition.current = { top: moduleY2LocalY(y), left: moduleX2LocalX(x) };

    // Start RAF
    start();
    return { id };
  }

  const onDragStop = () => {
    stop();
    dashboardContext?.updateChartPosition(chartId, {
      id,
      x,
      y,
      w,
      h,
    });
  }

  // Wire the Module to DnD Drag System
  const [{isDragging}, drag, preview] = useDrag(() => ({
    type: 'module',
    item: onDragStart,
    end: onDragStop,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [y, x]);

  //Disable Preview
  preview(getEmptyImage(), { captureDraggingState: true });

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    d: NumberSize
  ) => {
    console.log("stop", d);
    // Calculate tentative new width and height
    const tentativeW = ((moduleW2LocalWidth(w) + d.width))/(COLUMN_WIDTH);
    const tentativeH = h + d.height;

    // Check for collisions with the tentative new size
    const chartPositions = dashboardContext?.charts?.map((chart) => chart?.position);
    const collision = isColliding(chartPositions, {
      ...position,
      w: tentativeW,
      h: tentativeH
    }, moduleX2LocalX(x), y);

    if (!collision) {
      // Update size if no collision
      console.log("Not Colliding", tentativeW, tentativeH)
      updateSize(tentativeW, tentativeH);

      dashboardContext?.updateChartPosition(chartId, {
        id,
        w: tentativeW,
        h: tentativeH,
        y: y,
        x: x,
      });
    } else {
      console.log(position, collision)
    }

    stop();
  }

  const onResizeStart = (e: any, direction: Direction) => {
    start();
    console.log("start")
  }

  const handleChartRemoval = (chartId: number) => {
    setRemovalLoading(true);
    dashboardContext.removeChart(chartId)
    .finally(() => {
      setRemovalLoading(false);
    })
  }

  //Render
  return (
      <Box
        ref={moduleRef}
        display="flex"
        position="absolute"
        top={moduleY2LocalY(y)}
        left={moduleX2LocalX(x)}
        sx={{
          opacity: isDragging ? 0.5 : 1,
          
        }}
      >
        <Resizable
          boundsByDirection={true}
          minWidth={moduleW2LocalWidth(Math.floor(MIN_WIDTH/COLUMN_WIDTH))}
          minHeight={MIN_HEIGHT}
          grid={[COLUMN_WIDTH, 1]}
          style={{
            padding:"20px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            backgroundColor:"rgba(0, 0, 0, 0.5)",
            border: "dashed 1px",
            borderColor: "#302f2f",
          }}
          size={{
            width: moduleW2LocalWidth(w),
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
