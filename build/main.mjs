import webpack from "webpack";
import fs from "fs";
import { promisify } from "util";
import path, { join } from "path";
import fsEx from "fs-extra";
import { buildFolder as myBuildFolder } from "../paths.mjs";
import { tmpdir } from "os";
import AssetPlugin from "assets-webpack-plugin";
import { exitHandler } from "../util/exitHandler.mjs";
import { buildData } from "../content/buildData.mjs";
import { buildStatic } from "../content/buildStatic.mjs";

const rmdir = promisify(fs.rmdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const removeFile = promisify(fs.unlink);
const mkdtemp = promisify(fs.mkdtemp);

const run = (compiler) => new Promise((res) => {
  compiler.run((err, stats) => { // Stats Object
    if (err) {
      console.log(err);
      res();
      return;
    }
    console.log(stats.toString({ colors: true }));
    res();
  });
});

export const main = async (
  appParent, buildFolder, staticFolder, webpackConfig,
  rootFolder, contentFolder, urlBuilder, wellKnown,
) => {
  if (!fs.existsSync(join(appParent, 'App.jsx'))) {
    console.log(`${join(appParent, 'App.jsx')} does not exists. Exiting...`);
    process.exit(0);
  }
  const tempDir = await mkdtemp(join(tmpdir(), 'react-ssg-'));
  await rmdir(buildFolder, { recursive: true });
  const wiName = './entry-dfjdshfdjsfhjsk-gitignore.js';
  const wiPath = join(appParent, wiName);
  await fsEx.copy(join(myBuildFolder, 'server.js'), wiPath);
  const serverCompiler = webpack({
    ...webpackConfig,
    plugins: [
      ...webpackConfig.plugins,
      new AssetPlugin({ path: tempDir, removeFullPathAutoPrefix: true }),
    ],
    target: 'node',
    mode: 'development',
    node: {
      __dirname: false,
    },
    entry: {
      app: wiPath,
    },
    output: {
      path: tempDir,
      filename: 'main.js',
      libraryTarget: 'commonjs',
    },
  });
  await run(serverCompiler);
  await fsEx.copy(join(myBuildFolder, 'client.js'), wiPath);
  if (wellKnown) {
    await fsEx.copy(wellKnown, join(buildFolder, '.well-known'));
  }
  const clientCompiler = webpack({
    ...webpackConfig,
    plugins: [
      ...webpackConfig.plugins,
      new AssetPlugin({ path: tempDir, removeFullPathAutoPrefix: true }),
    ],
    mode: 'production',
    entry: {
      app: wiPath,
    },
    output: {
      path: path.resolve(buildFolder, './dist'),
      filename: 'app.[fullhash].bundle.js',
    },
  });
  await run(clientCompiler);
  const webpackAsset = JSON.parse((
    await readFile(path.join(tempDir, 'webpack-assets.json'))
  ).toString());
  const data = await buildData(contentFolder, buildFolder);
  const urls = urlBuilder(data);
  const { generator } = (await import(path.join(tempDir, 'main.js'))).default;
  const gh = generator({ data, webpackAsset });
  await buildStatic(staticFolder, buildFolder);
  await Promise.all(urls.map(async (url)=>{
    const pu = path.join(buildFolder, `.${url}`);
    await mkdir(pu, { recursive: true });
    await writeFile(path.join(pu, 'index.html'), gh(url));
  }));
  await rmdir(tempDir, { recursive: true });
  await removeFile(wiPath);  
};
