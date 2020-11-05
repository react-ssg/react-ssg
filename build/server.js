import { App } from "./App.jsx";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { StaticRouter } from "react-router-dom";
import { ContentContext } from "react-ssg";
import { Helmet } from "react-helmet";

const htmlTemplate = (elem, helmet, wa) => `
<html ${helmet.htmlAttributes.toString()}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">      
${helmet.title.toString()}
${helmet.meta.toString()}
${helmet.link.toString()}
${helmet.style.toString()}
${wa.app.css ? `<link rel="stylesheet" href="/dist/${wa.app.css}">` : ""}
</head>
<body ${helmet.bodyAttributes.toString()}>
<div id="app">${elem}</div>
<script src="/dist/${wa.app.js}"></script>
</body>
</html>
`;

export const generator = ({ data, webpackAsset }) => (url) => {
  const elem = ReactDOMServer.renderToString(
    <ContentContext.Provider value={data}>
      <StaticRouter location={url}>
        <App/>
      </StaticRouter>
    </ContentContext.Provider>
  );
  const helmet = Helmet.renderStatic();
  return htmlTemplate(elem, helmet, webpackAsset);
};
