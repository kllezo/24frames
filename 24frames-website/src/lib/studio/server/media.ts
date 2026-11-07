import path from "node:path";

export const mediaDir = () =>
  path.join(path.resolve(process.env.STUDIO_DATA_DIR || path.join(process.cwd(), ".studio-data")), "media");
