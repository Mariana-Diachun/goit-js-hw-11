import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { refs } from './js/refs.js';
import FetchImages from './js/fetchImages.js';

const fetchImages = new FetchImages();

removeButtonLoadMore();

let gallery = new SimpleLightbox('.gallery a', {
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

  clearPhotosContainer();

  const searchValue = evt.currentTarget.elements.searchQuery.value;
  if (!searchValue) return;
  fetchImages.query = searchValue;

  fetchImages.resetPage();

  fetchImages
    .getPhotos()
    .then(data => {
      infoMessage(data);
      renderingCards(data);
    })
    .catch(e => {
      removeButtonLoadMore();
      onSearchError();
    });
  addButtonLoadMore();

  evt.target.reset();
}

function onButtonLoadMore(evt) {
  evt.preventDefault();
  fetchImages.incrementPage();
  fetchImages
    .getPhotos()
    .then(data => {
      renderingCards(data);
    })
    .catch(showLastPageMessage);
}

function renderingCards(data) {
  const { hits } = data;
  const imagesMarkup = hits.reduce(
    (markUp, hit) => markUp + renderPhotoCard(hit),
    ''
  );
  refs.galleryContainer.insertAdjacentHTML('beforeend', imagesMarkup);
  gallery.refresh();
}

function showLastPageMessage(data) {
  const { total, totalHits } = data;
  if (total === totalHits) {
    refs.loadMoreBtn.classList.add('visually-hidden');
  }
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

function renderPhotoCard(data) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = data;
  const cardMarkup = `
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
  return cardMarkup;
}

function clearPhotosContainer() {
  refs.galleryContainer.innerHTML = '';
}

function infoMessage(data) {
  const { hits, totalHits } = data;
  if (hits.length === 0) {
    throw new Error();
  }
  Notiflix.Notify.info(`Hooay! We found ${totalHits} images.`);
}

function removeButtonLoadMore() {
  refs.loadMoreBtn.classList.add('visually-hidden');
}

function addButtonLoadMore() {
  refs.loadMoreBtn.classList.remove('visually-hidden');
}
function onSearchError() {
  return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
