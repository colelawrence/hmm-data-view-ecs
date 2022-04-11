import { convert, ident } from "./helpers.ts";
import { u32, ValueRetriever } from "./ValueRetriever.ts";
export * as typs from "./ValueRetriever.ts";

// for reference
function createValueReaderRGB(obj: {
  r: ValueRetriever<number>;
  g: ValueRetriever<number>;
  b: ValueRetriever<number>;
}): (
  dv: DataView,
  index: number
) => {
  $: number;
  r: number;
  g: number;
  b: number;
} {
  const SIZE = 4 + obj.r.bytes + obj.g.bytes + obj.b.bytes;
  let offset = 0;
  // const $_OFFSET = offset
  offset += 4; // $
  const r_OFFSET = offset;
  offset += obj.r.bytes; // r
  const g_OFFSET = offset;
  offset += obj.g.bytes; // g
  const b_OFFSET = offset;
  offset += obj.b.bytes; // b
  return (dv, idx) => {
    const AT = SIZE * idx;
    return {
      $: dv.getUint32(AT),
      r: dv.getUint32(AT + r_OFFSET),
      g: dv.getUint32(AT + g_OFFSET),
      b: dv.getUint32(AT + b_OFFSET),
    };
  };
}

export function createValueLens<T extends Record<string, ValueRetriever<any>>>(
  obj: T
): {
  write: (
    dv: DataView,
    index: number,
    $: number,
    values: {
      [P in keyof T]: T[P]["_type"];
    }
  ) => void;
  read: (
    dv: DataView,
    index: number
  ) => {
    $: number;
    v: {
      [P in keyof T]: T[P]["_type"];
    };
  };
} {
  const offsets: {
    id: string;
    offset: number;
    retriever: ValueRetriever<any>;
  }[] = [];
  let offsetAcc = 0;
  const VERSION = { id: "$", offset: offsetAcc, retriever: u32 };
  offsetAcc += convert(32).bitsToBytes();
  for (const key in obj) {
    offsets.push({ id: key, offset: offsetAcc, retriever: obj[key] });
    offsetAcc += obj[key].bytes;
  }
  const SIZE = offsetAcc;
  return {
    read: newFn(
      "dv",
      "idx",
      [
        //
        `idx*=${SIZE};`,
        `return {`,
        `$: dv.${
          VERSION.retriever.dvGetter.name
        }(idx+${VERSION.offset}),`,
        `v: {`,
        offsets
          .map(
            (a) =>
              `${ident(a.id).asJsObjDeclKey()}:dv.${
                a.retriever.dvGetter.name
              }(idx+${a.offset})`
          )
          .join(","),
        `}`,
        `}`,
      ].join("")
    ) as any,
    write: newFn(
      "dv",
      "idx",
      "$",
      "vals",
      [
        `idx*=${SIZE};`,
        `dv.${VERSION.retriever.dvSetter.name}(idx+${VERSION.offset}, $);`,
        ...offsets.map(
          (a) =>
            `dv.${a.retriever.dvSetter.name}(idx+${a.offset}, ${ident(
              "vals"
            ).withObjAccessKey(a.id)});`
        ),
      ].join("")
    ) as any,
  };
}

function newFn(...args: string[]) {
  console.debug("newFn", { args });
  return new Function(...args);
}
