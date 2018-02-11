import axios from 'axios';

const apiUrl = 'http://localhost:8000/api/';

export const getData = url =>
  axios.get(apiUrl + url)
    .then(res => res.data)
    .catch(err => err);

export const postData = (url, data) =>
  axios.post(apiUrl + url, data)
    .then(res => res.data)
    .catch(err => err);

export const putData = (url, data) =>
  axios.put(apiUrl + url, data)
    .then(res => res.data)
    .catch(err => err);

export const deleteData = url =>
  axios.delete(apiUrl + url)
    .then(res => res)
    .catch(err => err);
