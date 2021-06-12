import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';

let middleware = [];

if (__DEV__) {
	const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
	const createLogger = require('redux-logger').createLogger;

	const logger = createLogger({ collapsed: true });
	middleware = [...middleware, reduxImmutableStateInvariant/*, logger*/];
} else {
	middleware = [...middleware];
}

export default function configureStore(initialState) {
	return createStore(
		rootReducer,
		initialState,
		applyMiddleware(...middleware)
	);
}