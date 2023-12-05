//Deps
import React from 'react';
import { Box } from '@mui/material';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';

//Helpers
import { snapToGrid } from './../Module/CollisionHelpers';

//Components
import PreviewModule from '../PreviewModule/PreviewModule';

//Const
import { COLUMN_WIDTH, GUTTER_SIZE } from '../../../../constants';

//Props
interface CustomDragLayerProps {}

function getPositionStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset;

  const xDifference = x - initialOffset.x;
  const yDifference = y - initialOffset.y;
  const [xStep, yStep] = snapToGrid(xDifference, yDifference, COLUMN_WIDTH);
  const targetX = initialOffset.x + xStep;
  const targetY = initialOffset.y + yStep;
  
  const transform = `translate(${targetX - GUTTER_SIZE}px, ${targetY - GUTTER_SIZE}px)`;
  return {
    transform,
    WebkitTransform: transform,
    transformOrigin: "0px 0px"
  }
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  if(!isDragging){
    return null;
  }

  return (
    <Box sx={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }}>
      <Box sx={getPositionStyles(initialOffset, currentOffset)}>
        <PreviewModule height={item?.position?.h} width={item?.position?.w} />
      </Box>
    </Box>
  )
}

export default React.memo(CustomDragLayer);