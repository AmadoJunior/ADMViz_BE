import {
  COLUMN_WIDTH,
  GUTTER_SIZE,
  moduleW2LocalWidth,
  moduleX2LocalX,
} from "../../../../constants";
import { IModuleInterface } from "../../../../Context/ModuleContext/interfaces";

export const isColliding = (
  modules: IModuleInterface[],
  currentModule: IModuleInterface,
  newLeft: number,
  newTop: number
): IModuleInterface | undefined => {
  return modules.find((module) => {
    if (module.id === currentModule.id) return false;

    const verticalOverlap =
      newTop + currentModule.coord.h + GUTTER_SIZE > module.coord.y &&
      newTop < module.coord.y + module.coord.h + GUTTER_SIZE;

    const horizontalOverlap =
      Math.floor(newLeft / COLUMN_WIDTH) + currentModule.coord.w >
        module.coord.x &&
      Math.floor(newLeft / COLUMN_WIDTH) < module.coord.x + module.coord.w;

    return verticalOverlap && horizontalOverlap;
  });
};

export const findNearestFreePosition = (
  currentModule: IModuleInterface,
  collidingModule: IModuleInterface,
  newLeft: number,
  newTop: number
) => {
  const upCorrection =
    newTop + currentModule.coord.h - collidingModule.coord.y + GUTTER_SIZE;
  const downCorrection =
    collidingModule.coord.y + collidingModule.coord.h - newTop + GUTTER_SIZE;
  const leftCorrection =
    newLeft +
    moduleW2LocalWidth(currentModule.coord.w) -
    moduleX2LocalX(collidingModule.coord.x);
  const rightCorrection =
    moduleX2LocalX(collidingModule.coord.x) +
    moduleW2LocalWidth(collidingModule.coord.w) -
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
