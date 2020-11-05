import ReactDOM from "react-dom";
import React from "react";
import { App } from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ContentContext } from "react-ssg";

const main = async () => {
  const data = await (await fetch("/dist/data.bundle.json", {
    cache: 'no-cache',
  })).json();
  ReactDOM.render(
    <ContentContext.Provider value={data}>
      <BrowserRouter><App/></BrowserRouter>
    </ContentContext.Provider>,
    document.getElementById('app'),
  );
};

main();
