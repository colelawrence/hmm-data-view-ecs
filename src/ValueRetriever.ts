import { convert } from "./helpers.ts";

export type ValueRetriever<T> = {
  bytes: number;
  dvGetter: { name: string };
  dvSetter: { name: string };
  _type: T;
};

export const u32: ValueRetriever<number> = {
  bytes: convert(32).bitsToBytes(),
  dvGetter: DataView.prototype.getUint32,
  dvSetter: DataView.prototype.setUint32,
  _type: null!,
};

export const u16: ValueRetriever<number> = {
  bytes: convert(16).bitsToBytes(),
  dvGetter: DataView.prototype.getUint16,
  dvSetter: DataView.prototype.setUint16,
  _type: null!,
};

export const f32: ValueRetriever<number> = {
  bytes: convert(32).bitsToBytes(),
  dvGetter: DataView.prototype.getFloat32,
  dvSetter: DataView.prototype.setFloat32,
  _type: null!,
};
