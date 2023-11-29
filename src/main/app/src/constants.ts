export const MIN_WIDTH = 500;
export const MIN_HEIGHT = 565;
export const GUTTER_SIZE = 10;
export const COLUMN_WIDTH = 10;
export const moduleW2LocalWidth = (moduleW: number) =>
  moduleW * COLUMN_WIDTH + GUTTER_SIZE;
export const moduleX2LocalX = (moduleX: number) =>
  moduleW2LocalWidth(moduleX) - GUTTER_SIZE;
export const moduleY2LocalY = (moduleY: number) => moduleY + GUTTER_SIZE;
