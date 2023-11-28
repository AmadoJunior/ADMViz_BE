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

    const horizontalOverlap =
      Math.floor(newLeft / COLUMN_WIDTH) + currentModule.w >
        module.x &&
      Math.floor(newLeft / COLUMN_WIDTH) < module.x + module.w;

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
    moduleX2LocalX(collidingModule.x);
  const rightCorrection =
    moduleX2LocalX(collidingModule.x) +
    moduleW2LocalWidth(collidingModule.w) -
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
