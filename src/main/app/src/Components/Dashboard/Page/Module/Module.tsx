//Deps
import React, { useContext, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useDrag, useDragDropManager } from 'react-dnd';
import { useRafLoop } from 'react-use';
import { Resizable } from 're-resizable';
import { NumberSize } from "re-resizable";
import { Direction } from "re-resizable/lib/resizer";
import DeleteIcon from '@mui/icons-material/Delete';

//Context
import { ModuleContext } from '../../../../Context/ModuleContext/useModuleContext';

//State
import { ScreenContext } from '../../../../Context/ScreenContext/useScreenContext';

//Interfaces && Types
import { IModuleInterface } from '../../../../Context/ModuleContext/interfaces';

//Constants && Helpers
import { COLUMN_WIDTH, GUTTER_SIZE, MIN_HEIGHT, MIN_WIDTH, moduleW2LocalWidth, moduleX2LocalX, moduleY2LocalY } from '../../../../constants';
import {isColliding, findNearestFreePosition} from "./CollisionHelpers";

//Props
type ModuleProps = {
  data: IModuleInterface;
  children?: React.ReactNode
};

const Module: React.FC<ModuleProps> = ({data, children}) => {
  //Window Context
  const screenContext = React.useContext(ScreenContext);
  //Module Context
  const moduleContext = useContext(ModuleContext);

  //Props Destruct
  const { id, title, coord: { w, h } } = data;

  //State
  const [x, setX] = useState(data.coord.x);
  const [y, setY] = useState(data.coord.y);
  const initialPosition = React.useRef<{ top: number; left: number }>();

  //DnD Manager
  const dndManager = useDragDropManager();

  //Methods
  const updatePosition = (left: number, top: number) => {
    setY(top);
    setX(Math.floor(left / COLUMN_WIDTH));
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
        screenContext.width - w * COLUMN_WIDTH,
      ),
    );
  
    const collidingModule = isColliding(moduleContext.modules, data, newLeft, newTop);
    if (!collidingModule) {
      updatePosition(newLeft, newTop);
    } else {
      
      const { updatedLeft, updatedTop } = findNearestFreePosition(data, collidingModule, newLeft, newTop);
  
      const clampedTop = Math.max(0, updatedTop);
      const clampedLeft = Math.max(GUTTER_SIZE, Math.min(updatedLeft, screenContext.width - w * COLUMN_WIDTH));
      
      const updatedCollidingModule = isColliding(moduleContext.modules, data, clampedLeft, clampedTop);
      
      if (!updatedCollidingModule) {
        
        updatePosition(clampedLeft, clampedTop);
      } else {
        
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
    moduleContext.updateModule({
      id,
      title,
      coord: {
        x,
        y,
        w,
        h,
      }
    });
  }

  // Wire the Module to DnD Drag System
  const [, drag] = useDrag(() => ({
    type: 'module',
    item: onDragStart,
    end: onDragStop,
  }), [y, x]);

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    d: NumberSize
  ) => {
    stop();
    console.log("stop")
    moduleContext.updateModule({
      id,
      title,
      coord: {
        w: ((moduleW2LocalWidth(w) + GUTTER_SIZE + d.width))/(COLUMN_WIDTH),
        h: h + d.height,
        y: y,
        x: x,
      },
    });
  }

  const onResizeStart = (e: any, direction: Direction) => {
    start();
    console.log("start")
  }

  //Render
  return (
      <Box
        display="flex"
        position="absolute"
        top={moduleY2LocalY(y)}
        left={moduleX2LocalX(x)}
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
          defaultSize={{
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
            width: "100%"
          }}
          draggable
        >
          <Button variant='contained' color="error"  sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 5,
          }}
            onClick={() => moduleContext.removeModule(data)}
          >
            <DeleteIcon/>
          </Button>
          {children}
        </Box>
        </Resizable>
      </Box>
 
  );
};

export default React.memo(Module);