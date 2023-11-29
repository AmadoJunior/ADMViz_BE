import {
  COLUMN_WIDTH,
  GUTTER_SIZE,
  moduleW2LocalWidth,
  moduleX2LocalX,
} from "../../../../constants";
import { IChartPosition } from "../../../../Context/DashboardContext/interfaces";

export const isColliding = (
  chartPositions: IChartPosition[],
  currentModule: IChartPosition,
  newLeft: number,
  newTop: number
): IChartPosition | undefined => {
  return chartPositions.find((module) => {
    if (module.id === currentModule.id) return false;

    const verticalOverlap =
      newTop + currentModule.h + GUTTER_SIZE > module.y &&
      newTop < module.y + module.h + GUTTER_SIZE;

    const currentModuleRightEdge = (newLeft / COLUMN_WIDTH) + currentModule.w + GUTTER_SIZE/COLUMN_WIDTH;
    const moduleRightEdge = module.x + module.w + GUTTER_SIZE/COLUMN_WIDTH;
    
    const horizontalOverlap =
      currentModuleRightEdge > module.x &&
      (newLeft / COLUMN_WIDTH) < moduleRightEdge;
    return verticalOverlap && horizontalOverlap;
  });
};

export const findNearestFreePosition = (
  currentModule: IChartPosition,
  collidingModule: IChartPosition,
  newLeft: number,
  newTop: number
) => {
  const upCorrection =
    newTop + currentModule.h - collidingModule.y + GUTTER_SIZE;
  const downCorrection =
    collidingModule.y + collidingModule.h - newTop + GUTTER_SIZE;
  const leftCorrection =
    newLeft +
    moduleW2LocalWidth(currentModule.w) -
    moduleX2LocalX(collidingModule.x) - GUTTER_SIZE;
  const rightCorrection =
    moduleX2LocalX(collidingModule.x) +
    moduleW2LocalWidth(collidingModule.w) + GUTTER_SIZE -
    newLeft;
  const isUpOrDown =
    Math.min(upCorrection, downCorrection) <
    Math.min(leftCorrection, rightCorrection);

  const updatedTop =
    newTop +
    (isUpOrDown
      ? upCorrection < downCorrection
        ? -upCorrection
        : downCorrection
      : 0);
  const updatedLeft =
    newLeft +
    (!isUpOrDown
      ? leftCorrection < rightCorrection
        ? -(leftCorrection + COLUMN_WIDTH * 2)
        : rightCorrection
      : 0);

  return {
    updatedLeft,
    updatedTop,
  };
};
