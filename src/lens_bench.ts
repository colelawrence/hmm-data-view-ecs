import { createValueLens, typs } from "./createValueLens.ts";

const rgb = createValueLens({
  r: typs.u32,
  g: typs.u32,
  b: typs.u32,
});

const ab = new ArrayBuffer(100024);
const dv = new DataView(ab);

Deno.bench("lens write", () => {
  for (let i = 0; i < 1000; i++) {
    rgb.write(dv, i, i, {
      r: i * 2,
      g: i * 3,
      b: i * 4,
    });
  }
});

Deno.bench("lens read", () => {
  for (let i = 0; i < 1000; i++) {
    const {
      $,
      v: { r, g, b },
    } = rgb.read(dv, i);
    const total = $ + r + g + b;
  }
});

const arr = new Array(1000);
Deno.bench("array write", () => {
  for (let i = 0; i < 1000; i++) {
    arr[i] = {
      $: i,
      v: {
        r: i * 2,
        g: i * 3,
        b: i * 4,
      },
    };
  }
});

Deno.bench("array read", () => {
  for (let i = 0; i < 1000; i++) {
    const {
      $,
      v: { r, g, b },
    } = arr[i];
    const total = $ + r + g + b;
  }
});

const map = new Map();
Deno.bench("map write", () => {
  for (let i = 0; i < 1000; i++) {
    map.set(i, {
      $: i,
      v: {
        r: i * 2,
        g: i * 3,
        b: i * 4,
      },
    });
  }
});

Deno.bench("map read", () => {
  for (let i = 0; i < 1000; i++) {
    const {
      $,
      v: { r, g, b },
    } = map.get(i);
    const total = $ + r + g + b;
  }
});

const arr2 = new Array(1000);
Deno.bench("array write packed", () => {
  for (let i = 0; i < 1000; i++) {
    arr2[i] = [i, i * 2, i * 3, i * 4];
  }
});

Deno.bench("array read packed", () => {
  for (let i = 0; i < 1000; i++) {
    const [$, r, g, b] = arr2[i];
    const total = $ + r + g + b;
  }
});
