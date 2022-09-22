import axios from 'axios';

export default class FetchImages {
  constructor() {
    this.page = 1;
    this.perPage = 40;
    this.query = '';
  }

  getQuery() {
    return this.query;
  }
  setQuery(newQuery) {
    this.query = newQuery;
    this.page = 1;
  }
  incrementPage() {
    this.page += 1;
  }
  getCurrentPage() {
    return this.page;
  }
  getPerPageAmount() {
    return this.perPage;
  }
  resetPage() {
    this.page = 1;
  }
  async getPhotos() {
    const BASE_URL = 'https://pixabay.com/api/';
    const apiKey = '29855363-01552555bb9c5e3aa2475f468';
    const url = `${BASE_URL}?key=${apiKey}&q=${this.query}&image_type=photo&per_page=${this.perPage}&page=${this.page}&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    const data = await response.data;
    return data;
  }
}
