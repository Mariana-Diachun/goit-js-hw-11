const BASE_URL = 'https://pixabay.com/api/';
const apiKey = '29855363-01552555bb9c5e3aa2475f468';

import axios from 'axios';

export function getPhotos(keyWord) {
  return axios
    .get(
      `${BASE_URL}/?key=${apiKey}&q=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true`
    )
    .then(response => {
      console.log(response.data);
    });
}
