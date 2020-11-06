import { dirname, join } from "path";

const errorBuilder = (path) => {
  return new Error(`Parameter ${path} is mandatory`);
};

const pathFill = (path) => {
  if (!path.root) throw errorBuilder('path.root');
  const root = path.root;
  const app = path.app ?? join(root, './src/App.jsx');
  if (!app.endsWith('App.jsx')) {
    throw new Error("path.app filename must equal to App.jsx");
  }
  const appParent = dirname(app);
  const build = path.build ?? join(root, './public');
  const assets = path.assets ?? join(root, './static');
  const content = path.content ?? join(root, './content');
  return {
    root, app, appParent, build, assets, content,
  };
};

const webpackFill = (webpack) => {
  if (!webpack.baseConfig) throw errorBuilder('webpack.baseConfig');
  const { baseConfig } = webpack;
  return {
    baseConfig,
  };
};


export const paramFill = (params = {}) => {
  if (!params.path) throw errorBuilder('path');
  if (!params.webpack) throw errorBuilder('webpack');
  if (!params.urls) throw errorBuilder('urls');
  return {
    path: pathFill(params.path),
    webpack: webpackFill(params.webpack),
    urls: params.urls,
  };
};
