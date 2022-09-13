const BASE_URL = 'https://pixabay.com/api/';
const apiKey = '29855363-01552555bb9c5e3aa2475f468';

import axios from 'axios';

export function getPhotos(searchQuery) {
  axios
    .get(
      `${BASE_URL}/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`
    )
    .then(response => {
      photos = response.data.hits;
      return console.log(photos);
    });
}
