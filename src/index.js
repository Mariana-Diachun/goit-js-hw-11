import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs.js';
import FetchImages from './fetchImages.js';

const fetchImages = new FetchImages();

new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onButtonLoadMore);

function onFormSubmit(evt) {
  evt.preventDefault();
  clearPhotoscontainer();

  fetchImages.query = evt.currentTarget.elements.searchQuery.value;
  fetchImages.resetPage();
  if (fetchImages.query === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  fetchImages.getPhotos().then(renderingCards);
}

function onButtonLoadMore(evt) {
  evt.preventDefault();
  fetchImages.incrementPage();
  fetchImages
    .getPhotos()
    .then(renderingCards)
    .catch(error => console.log(error));
}

function renderingCards(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', renderPhotoCard(hits));
}

function renderPhotoCard(hits) {
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
        <li class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class = "gallery__image" />
            
            <ul class="info">
                <li class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
                </li>
                <li class="info-item">
                <b>Views</b>
                <span>${views}</span>
                </li>
                <li class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
                </li>
                <li class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
                </li>
            </ul>
        </a>
    </li>`;
      }
    )
    .join('');
}
function clearPhotoscontainer() {
  refs.galleryContainer.innerHTML = '';
}
