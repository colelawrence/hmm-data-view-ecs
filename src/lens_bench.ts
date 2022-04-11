import { createValueLens, typs } from "./createValueLens.ts";

/*
Initial run:

running 10 benches from file:///Users/cole/theatre/my-first-project/src/lens_bench.ts
bench lens write ... 1000 iterations 4,397 ns/iter (3,958..41,958 ns/iter) ok (18ms)
bench lens read ... 1000 iterations 5,261 ns/iter (4,417..99,458 ns/iter) ok (20ms)
bench array write ... 1000 iterations 19,595 ns/iter (10,209..880,917 ns/iter) ok (56ms)
bench array read ... 1000 iterations 5,064 ns/iter (4,333..63,875 ns/iter) ok (15ms)
bench lens write ... 1000 iterations 3,841 ns/iter (3,250..442,083 ns/iter) ok (15ms)
bench lens read ... 1000 iterations 5,894 ns/iter (4,292..111,833 ns/iter) ok (19ms)
bench map write ... 1000 iterations 40,170 ns/iter (30,958..510,709 ns/iter) ok (93ms)
bench map read ... 1000 iterations 19,240 ns/iter (13,000..559,292 ns/iter) ok (44ms)
bench array write packed ... 1000 iterations 19,494 ns/iter (10,291..970,375 ns/iter) ok (46ms)
bench array read packed ... 1000 iterations 10,154 ns/iter (8,000..464,917 ns/iter) ok (32ms)

bench result: ok. 10 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (378ms)
*/

// type EntityId = number

// const storages = new Map<{ new(): any }, Map<EntityId, any>>()

// function getEntities<C extends { new(...args: any[]): any }>(c: C): C extends { new(...args: any[]): infer R } ? R[] : never {
//   return Array.from(storages.get(c)?.values() ?? []) as any
// }

// class Position {
//   constructor(
//     public readonly x: number,
//     public readonly y: number,
//   ) {}
// }
// class Aggression {
//   constructor(
//     public readonly towards?: EntityId,
//   ) {}
// }

// type Pos = {
//   x: number,
//   y: number
// }

// const es0 = getEntities<Pos>()
// const es1 = getEntities(Position)
// const es2 = getEntities({ pos: Position, aggression: Aggression }) // { pos, aggression }[]

const rgb = createValueLens({
  r: typs.u32,
  g: typs.u32,
  b: typs.u32,
});

const rgbf = createValueLens({
  r: typs.f32,
  g: typs.f32,
  b: typs.f32,
});

const point2d = createValueLens({
  x: typs.u32,
  y: typs.u32,
});

const ab0 = new ArrayBuffer(100024);
const dv0 = new DataView(ab0);

Deno.bench("lens write (point2d)", () => {
  for (let i = 0; i < 1000; i++) {
    point2d.write(dv0, i, i, {
      x: i * 2,
      y: i * 3,
    });
  }
});

Deno.bench("lens read (point2d)", () => {
  for (let i = 0; i < 1000; i++) {
    const {
      $,
      v: { x, y },
    } = point2d.read(dv0, i);
    const total = $ + x + y;
  }
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

Deno.bench("lens write (f32)", () => {
  for (let i = 0; i < 1000; i++) {
    rgbf.write(dv, i, i, {
      r: i * 2,
      g: i * 3,
      b: i * 4,
    });
  }
});

Deno.bench("lens read (f32)", () => {
  for (let i = 0; i < 1000; i++) {
    const {
      $,
      v: { r, g, b },
    } = rgbf.read(dv, i);
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
for (let N = 0; N < 10; N++) {
  Deno.bench(`lens write (${N}x)`, () => {
    for (let n = 0; n < N; n++) {
      for (let i = 0; i < 1000; i++) {
        rgb.write(dv, i, i + N, {
          r: i * 2 + N,
          g: i * 3 + N,
          b: i * 4 + N,
        });
      }
    }
  });
}
for (let N = 0; N < 10; N++) {
  Deno.bench(`array write (${N}x)`, () => {
    for (let n = 0; n < N; n++) {
      for (let i = 0; i < 1000; i++) {
        arr[i] = {
          $: i + N,
          v: {
            r: i * 2 + N,
            g: i * 3 + N,
            b: i * 4 + N,
          },
        };
      }
    }
  });
}

Deno.bench("array read", () => {
  for (let i = 0; i < 1000; i++) {
    const {
      $,
      v: { r, g, b },
    } = arr[i];
    const total = $ + r + g + b;
  }
});

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
