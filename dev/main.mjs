import webpack from "webpack";
import fs from "fs";
import { promisify } from "util";
import path, { join } from "path";
import fsEx from "fs-extra";
import { devFolder as myDevFolder } from "../paths.mjs";
import { buildData } from "../content/buildData.mjs";
import { tmpdir } from "os";
import AssetPlugin from "assets-webpack-plugin";
import { exitHandler } from "../util/exitHandler.mjs";

const rmdir = promisify(fs.rmdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const removeFile = promisify(fs.unlink);
const mkdtemp = promisify(fs.mkdtemp);

export const main = async (
  appParent, buildFolder, staticFolder, webpackConfig, rootFolder, contentFolder,
) => {
  const tempDir = await mkdtemp(join(tmpdir(), 'react-ssg-'));
  const wiName = './client-sdjsafjkhdsf-gitignore.js';
  const wiPath = join(appParent, wiName);
  await fsEx.copy(join(myDevFolder, 'client.js'), wiPath);
  await rmdir(buildFolder, { recursive: true });
  let started = false;
  const compiler = webpack({
    ...webpackConfig,
    plugins: [
      ...webpackConfig.plugins,
      new AssetPlugin({ path: tempDir }),
    ],
    mode: 'development',
    context: appParent,
    entry: {
      app: wiName,
    },
    output: {
      path: path.resolve(buildFolder, './dist'),
      filename: 'app.[fullhash].bundle.js',
    },
  });
  const watching = compiler.watch({}, async (err, stats) => {
    if (err || stats.hasErrors()) {
      if (err) {
        console.error(err);
      } else {
        console.error(stats.toString({ colors: true }));
      }
      console.log('Failed at ' + (new Date));
      return;
    }
    const wa = JSON.parse((
      await readFile(path.join(tempDir, 'webpack-assets.json'))
    ).toString());
    await writeFile(path.join(buildFolder, '404.html'), `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/dist/${wa.app.css.slice(5)}">
      </head>
      <body>
        <div id="app"></div>
        <script src="/dist/${wa.app.js.slice(5)}"></script>
      </body>
    </html>
    `);
    console.log('Builded at ' + (new Date));
    started = true;
  });
  exitHandler(async () => {
    started = false;
    console.log('Stop watching...');
    await new Promise((res) => watching.close(()=>res()));
    console.log('Removing files...');
    await rmdir(tempDir, { recursive: true });
    await removeFile(wiPath);
    console.log('Exited successfully');
  });
  (async () => {
    while (true) {
      await new Promise(res=>setTimeout(res, 2000));
      if (!started) continue;
      await buildData(contentFolder, buildFolder);
      await fsEx.copy(
        staticFolder,
        join(buildFolder, 'dist', 'static'),
      );
    }
  })();
};
