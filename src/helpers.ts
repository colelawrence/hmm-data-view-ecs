export function ident(s: string) {
  return {
    asJsObjDeclKey() {
      if (RE_JS_IDENT.test(s)) {
        return s;
      } else {
        return JSON.stringify(s);
      }
    },
    withObjAccessKey(key: string) {
      if (RE_JS_IDENT.test(key)) {
        return `${s}.${key}`;
      } else {
        return `${s}[${JSON.stringify(key)}]`;
      }
    },
  };
}

const RE_JS_IDENT = /^[\$a-zA-Z_][\$\w]*$/;
export function convert(n: number) {
  return {
    bitsToBytes() {
      return n / 8;
    },
  };
}
