import './css/styles.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import Notiflix from 'notiflix';
import { getPhotos } from './getPhotos.js';
import { refs } from './refs.js';

// let searchQuery = null;
// let photos = {};
const BASE_URL = 'https://pixabay.com/api/';
const apiKey = '29855363-01552555bb9c5e3aa2475f468';

refs.form.addEventListener('submit', onButtonSearch);

function onButtonSearch(evt) {
  evt.preventDefault();

  const form = evt.currentTarget;
  const searchQuery = form.elements.searchQuery.value;
  if (!searchQuery) {
    refs.galleryContainer.innerHTML = '';
  }
  function getPhotos(searchQuery) {
    axios
      .get(
        `${BASE_URL}/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`
      )
      .then(response => {
        photos = response.data.hits;
        // return photos;
        console.log(photos);
      });
  }
  // getPhotos()
  //   .then(renderingCards)
  //   .catch(error => console.log(error));
}

function renderingCards({ hits }) {
  if (photos.length < 0) {
    onSearchError();
  } else {
    const photoMarkup = renderPhotoCard(photos);
    refs.galleryContainer.innerHTML(photoMarkup);
  }
}
function renderPhotoCard(photos) {
  return photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
        <a class="photo-item" src="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
}

// new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionsDelay: 250,
// });

function onSearchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 2000,
    }
  );
}
