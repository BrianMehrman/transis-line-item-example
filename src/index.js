import React from "react";
import { render } from "react-dom";
import App from "src/app";

const models = require.context("./models", true);
models.keys().forEach(models);
window.Transis = Transis;

render(<App />, document.getElementById("app"));

module.hot.accept();
