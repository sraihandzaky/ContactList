import {createStore, applyMiddleware} from 'redux';
import {mainReducers} from './Reducers';
import thunk from 'redux-thunk';

export const store = createStore(mainReducers, applyMiddleware(thunk));
