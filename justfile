build:
  esbuild ./src/entry.ts --bundle --outdir=dist

dev:
  esbuild ./src/entry.ts --bundle --outdir=dist --servedir=dist
