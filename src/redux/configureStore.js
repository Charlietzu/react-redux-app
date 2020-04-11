import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/index";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";

export default function configureStore(initialState) {
  /**add support for Redux dev tools */
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return createStore(
    rootReducer,
    initialState,
    /**reduxImmutableStateInvariant will warn us if we accidentally mutate
     * redux state
     */
    composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant()))
  );
}
