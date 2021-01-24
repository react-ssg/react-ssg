import commander from "commander";
import { paramFill } from "./paramFill.mjs";
import { main as devMain } from "./dev/main.mjs";
import { main as buildMain } from "./build/main.mjs";

const { Command } = commander;

export const cli = (params) => {
  const {
    path: { appParent, build, assets, root, content, wellKnown },
    webpack: { baseConfig },
    urls,
  } = paramFill(params);
  const program = new Command();
  program.command('dev').action(async () => {
    devMain(appParent, build, assets, baseConfig, root, content);
  });
  program.command('build').action(async () => {
    buildMain(appParent, build, assets, baseConfig, root, content, urls, wellKnown);
  });
  program.parse(process.argv);
};

