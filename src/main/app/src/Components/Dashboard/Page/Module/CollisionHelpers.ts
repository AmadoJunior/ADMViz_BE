import {
  COLUMN_WIDTH,
  GUTTER_SIZE,
  moduleW2LocalWidth,
  moduleX2LocalX,
} from "../../../../constants";
import { IChart } from "../../../../Context/DashboardContext/interfaces";

type ChartPosition = Pick<IChart, "chartId" | "position">;

export const isColliding = (
  chartPositions: ChartPosition[],
  currentModule: ChartPosition,
  newLeft: number,
  newTop: number
): ChartPosition | undefined => {
  return chartPositions.find((module) => {
    if (module.chartId === currentModule.chartId) return false;

    const verticalOverlap =
      newTop + currentModule.position.h + GUTTER_SIZE > module.position.y &&
      newTop < module.position.y + module.position.h + GUTTER_SIZE;

    const horizontalOverlap =
      Math.floor(newLeft / COLUMN_WIDTH) + currentModule.position.w >
        module.position.x &&
      Math.floor(newLeft / COLUMN_WIDTH) < module.position.x + module.position.w;

    return verticalOverlap && horizontalOverlap;
  });
};

export const findNearestFreePosition = (
  currentModule: ChartPosition,
  collidingModule: ChartPosition,
  newLeft: number,
  newTop: number
) => {
  const upCorrection =
    newTop + currentModule.position.h - collidingModule.position.y + GUTTER_SIZE;
  const downCorrection =
    collidingModule.position.y + collidingModule.position.h - newTop + GUTTER_SIZE;
  const leftCorrection =
    newLeft +
    moduleW2LocalWidth(currentModule.position.w) -
    moduleX2LocalX(collidingModule.position.x);
  const rightCorrection =
    moduleX2LocalX(collidingModule.position.x) +
    moduleW2LocalWidth(collidingModule.position.w) -
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
