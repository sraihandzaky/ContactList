import {FETCH_DATA} from './ActionTypes';
import axios from 'axios';

const initialState = {
  contactList: [],
};

export const mainReducers = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA:
      return {...state, contactList: action.payload};
    default:
      return initialState;
  }
};
