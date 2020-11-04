import {FETCH_DATA} from './ActionTypes';
import axios from 'axios';

export const fetchData = () => {
  return dispatch => {
    return axios
      .get('https://simple-contact-crud.herokuapp.com/contact')
      .then(res => {
        let myListData = [];
        const requestResponse = res.data.data;
        requestResponse.map((item, index) => {
          myListData.push({
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            age: item.age,
            photo: item.photo,
            key: index.toString(),
          });
        });
        dispatch(
          fetchedData(
            myListData.sort((a, b) => a.firstName.localeCompare(b.firstName)),
          ),
        );
      });
  };
};

export const fetchedData = contactList => {
  return {
    type: FETCH_DATA,
    payload: contactList,
  };
};
