//Deps
import React from 'react';
import { Box } from '@mui/material';
import type { XYCoord } from 'react-dnd';
import { useDragLayer, useDragDropManager } from 'react-dnd';

//Helpers
import { snapToGrid } from './../Module/CollisionHelpers';

//Components
import PreviewModule from '../PreviewModule/PreviewModule';

//Const
import { COLUMN_WIDTH, GUTTER_SIZE } from '../../../../constants';
import { useRafLoop } from 'react-use';

function getPositionStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  parentEl: React.MutableRefObject<HTMLInputElement>,
): React.CSSProperties {
  if (!initialOffset || !currentOffset || !parentEl?.current) {
    return {
      display: 'none',
    }
  }
  const parentOrigin = {
    x: parentEl.current?.offsetLeft - parentEl.current?.scrollLeft,
    y: parentEl.current?.offsetTop - parentEl.current?.scrollTop,
  };
  const { x, y } = currentOffset;

  const xDifference = x - initialOffset.x;
  const yDifference = y - initialOffset.y;
  const [xStep, yStep] = snapToGrid(xDifference, yDifference, COLUMN_WIDTH);
  const targetX = initialOffset.x + xStep;
  const targetY = initialOffset.y + yStep;
  
  const transform = `translate(${targetX - (GUTTER_SIZE + parentOrigin.x)}px, ${targetY - (GUTTER_SIZE + parentOrigin.y)}px)`;
  return {
    transform,
    WebkitTransform: transform,
  }
}

//Props
interface CustomDragLayerProps {
  parentEl: React.MutableRefObject<HTMLInputElement>;
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({parentEl}) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const [positionStyle, setPositionStyle] = React.useState(getPositionStyles(initialOffset, currentOffset, parentEl));
  const handleStyles = React.useCallback(() => {
    console.log("Raf Running")
    setPositionStyle(getPositionStyles(initialOffset, currentOffset, parentEl));
  }, [initialOffset, currentOffset, parentEl?.current, setPositionStyle]);

  const [stop, start] = useRafLoop(handleStyles, true);

  React.useEffect(() => {
    if(isDragging){
      start();
    } else {
      stop();
    }
  }, [isDragging])

  if(!isDragging){
    return null;
  }

  return (
    <Box sx={{
      position: 'relative',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }}>
      <Box position="absolute" sx={positionStyle}>
        <PreviewModule height={item?.position?.h} width={item?.position?.w} />
      </Box>
    </Box>
  )
}

export default React.memo(CustomDragLayer);