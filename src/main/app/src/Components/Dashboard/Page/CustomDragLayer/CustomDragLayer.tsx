//Deps
import React from 'react';
import { Box } from '@mui/material';
import type { XYCoord } from 'react-dnd';
import { useDragLayer, useDragDropManager } from 'react-dnd';

//Helpers
import { snapToGrid, getCollidingModule } from './../Module/CollisionHelpers';

//Context
import { DashboardContext } from '../../../../Context/DashboardContext/useDashboardContext';

//Components
import PreviewModule from '../PreviewModule/PreviewModule';

//Const
import { COLUMN_WIDTH, GUTTER_SIZE } from '../../../../constants';
import { useRafLoop } from 'react-use';

function getPositionStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  parentEl: React.MutableRefObject<HTMLInputElement>,
  initialWidth: number,
  initialHeight: number,
  resizeDelta: { width: number, height: number }
): React.CSSProperties {
  if (!initialOffset || !currentOffset || !parentEl?.current) {
    return { display: 'none' };
  }

  // Calculate the scale factors
  const scaleX = (initialWidth + resizeDelta.width) / initialWidth;
  const scaleY = (initialHeight + resizeDelta.height) / initialHeight;

  // Adjust translation for the bottom-right corner
  const transformedX = initialOffset.x - parentEl.current.offsetLeft;
  const transformedY = initialOffset.y - parentEl.current.offsetTop;

  const transform = `translate(${transformedX}px, ${transformedY}px) scale(${scaleX}, ${scaleY})`;
  
  return {
    transform,
    WebkitTransform: transform,
  };
}

//Props
interface CustomDragLayerProps {
  parentEl: React.MutableRefObject<HTMLInputElement>;
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({parentEl}) => {
  //Dash Context
  const {charts} = React.useContext(DashboardContext);

  //DnD Manager
  const initialPosition = React.useRef<{ top: number; left: number }>();
  const dndManager = useDragDropManager();
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const [canDrop, setCanDrop] = React.useState(true);
  console.log(itemType)
  const [positionStyle, setPositionStyle] = React.useState({});
  
  const handleStyles = React.useCallback(() => {
    console.log("Raf Running")
    
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();
    const currentChart = dndManager.getMonitor().getItem();
    const resizeDelta = itemType === 'resize' && currentOffset && initialOffset ? {
      width: currentOffset.x - initialOffset.x,
      height: currentOffset.y - initialOffset.y,
    } : { width: 0, height: 0 };

    const initialWidth = item?.position?.w || 0;
    const initialHeight = item?.position?.h || 0;

    const newPositionStyle = getPositionStyles(
      initialOffset, currentOffset, parentEl, initialWidth, initialHeight, resizeDelta
    );

    setPositionStyle(newPositionStyle);

    if (!initialPosition.current || !movement) {
      return;
    }
  
    let left = Math.round(initialPosition.current.left + movement.x);
    let top = Math.round(initialPosition.current.top + movement.y);

    const [newLeft, newTop] = snapToGrid(left, top, COLUMN_WIDTH);
  
    const collidingChart = getCollidingModule(charts, currentChart, newLeft, newTop);
    if (!collidingChart) {
      console.log("candrop")
      setCanDrop(true);
    } else {
      console.log("cannotdrop")
      setCanDrop(false);
    }
  }, [initialOffset, currentOffset, parentEl, charts, setPositionStyle, itemType, item?.position?.w, item?.position?.h]);

  const [stop, start] = useRafLoop(handleStyles, true);

  React.useEffect(() => {
    if(isDragging){
      start();
    } else {
      stop();
    }
  }, [isDragging])

  React.useEffect(() => {
    if(item?.position) {
      initialPosition.current = {
        top: item.position?.y,
        left: item.position?.x,
      }
    }
  }, [item])

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
      <Box position="absolute" sx={{
        ...positionStyle,
      }}>
        <PreviewModule height={item?.position?.h + GUTTER_SIZE*2} width={item?.position?.w + GUTTER_SIZE*2} canDrop={canDrop} />
      </Box>
    </Box>
  )
}

export default React.memo(CustomDragLayer);