import { TransformFnParams } from "class-transformer";

export const transformCoordinates = ({
  value,
}: TransformFnParams): [number, number] | undefined => {
  if (typeof value === "string") {
    const coords = value.split(",").map((v) => parseFloat(v.trim()));
    if (coords.length !== 2 || coords.some(isNaN)) return undefined;
    return coords as [number, number];
  }

  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((v) => typeof v === "number")
  ) {
    return value as [number, number];
  }

  return undefined;
};
