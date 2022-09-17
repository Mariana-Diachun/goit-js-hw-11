import './css/styles.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import Notiflix from 'notiflix';
// import { getPhotos } from './getPhotos.js';
import { refs } from './refs.js';

let searchQuery = '';

refs.form.addEventListener('submit', onButtonSearch);

function onButtonSearch(evt) {
  evt.preventDefault();

  searchQuery = evt.target.elements.searchQuery.value.trim();
  getNewPhotos();

  if (!searchQuery) {
    refs.galleryContainer = '';
  }
}

function getNewPhotos() {
  getPhotos()
    .then(({ data }) => {
      renderingCards(data);
    })
    .catch(onError());
}

async function getPhotos() {
  const BASE_URL = 'https://pixabay.com/api';
  const apiKey = '29855363-01552555bb9c5e3aa2475f468';
  const PARAMS =
    'per_page=40&orientation=horizontal&image_type=photo&safesearch=true';
  try {
    const url = `${BASE_URL}/?key=${apiKey}&q=${searchQuery}&page=1&${PARAMS}`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.log(error);
  }
}

function renderingCards(data) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', renderPhotoCard(data));
}

function renderPhotoCard({ hits }) {
  return hits
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
        <a class="photo-item" src="${largeImageURL}">
        <div class="photo-card">
  <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
</div>
</a>`;
      }
    )
    .join('');
}
function onError() {
  return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
});
