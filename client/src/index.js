import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import ReactGA from "react-ga";
import * as Sentry from "@sentry/browser";

import ErrorBoundary from "./components/error/ErrorBoundary";
import configureStore from "./store/configureStore";
import routes from "./routes";

import "styles/app.css";
import "styles/redesign.css";

import "styles/bootstrap/css/bootstrap.css";

import "font-awesome/css/font-awesome.css";
import "react-select/dist/react-select.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactGA.initialize("UA-97076428-1");
Sentry.init({
  dsn: "https://d340302c572744e39248674db17d6230@sentry.io/1296136"
});

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} onUpdate={logPageView}>
      <Route path="" component={ErrorBoundary}>
        {routes}
      </Route>
    </Router>
  </Provider>,

  document.getElementById("root")
);
