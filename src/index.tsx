import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppProvider } from "./AppContext";

const render = (Component: any) => {
  ReactDOM.render(
    <AppProvider>
      <Component />
    </AppProvider>,
    document.getElementById("root")
  );
};

render(App);

if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}
