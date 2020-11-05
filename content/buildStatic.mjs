import { join } from "path";
import fsEx from "fs-extra";

export const buildStatic = async (staticFolder, buildFolder) => {
  try {
    await fsEx.copy(
      staticFolder,
      join(buildFolder, 'dist', 'static'),
    );
    return true;
  } catch(e) {
    return false;
  }
};
