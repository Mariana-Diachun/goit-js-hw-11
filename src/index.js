import './css/styles.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import Notiflix from 'notiflix';
import { getPhotos } from './getPhotos.js';
import { refs } from './refs.js';
import { renderPhotoCard } from './renderPhotoCard.js';

// const apiKey = '29855363-01552555bb9c5e3aa2475f468';

refs.form.addEventListener('submit', onButtonSearch);

function onButtonSearch(evt) {
  evt.preventDefault();
  const form = evt.currentTarget;
  const searchQuery = form.elements.searchQuery.value;
  if (!searchQuery) {
    refs.galleryContainer.innerHTML = '';
  }

  axios
    .get(getPhotos(searchQuery))
    .then(renderPhotoCard)
    .catch(error => {
      console.log(error);
    });
}

function renderPhotoCard(photos) {
  if (photos.length < 0) {
    onError();
  } else {
    const photoMarkup = renderPhotoCard(photos);
    refs.galleryContainer.innerHTML(photoMarkup);
  }
}

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
});

function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 2000,
    }
  );
}
