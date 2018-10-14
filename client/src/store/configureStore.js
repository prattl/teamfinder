import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import middleware from "./middleware";
import reducer from "./reducer";

const configureStore = initialState =>
  createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );

export default configureStore;
