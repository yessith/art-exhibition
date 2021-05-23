const URL_API = 'https://api.artic.edu/api/v1/artworks/';
const URL_IMAGE = 'https://www.artic.edu/iiif/2/:id';
const IMAGE_SIZE = '/full/843,/0/default.jpg/';

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Ooops, error', error.message);
    return error.message;
  }
};

const getDataArtPictures = async () => {
  try {
    const response = await fetchData(URL_API);
    const dataApi = await response.data;
    const getId = dataApi.map((data) => data.id);
    const createUrl = getId.map((id) => `${URL_API}${id}`);
    const resposePictures = createUrl.map((url) => fetchData(url));
    const dataPictures = await Promise.all(resposePictures);
    createPictureObject(dataPictures);
  } catch (error) {
    console.log('Ooops, error', error.message);
  }
};

const createPictureObject = (dataPictures) => {
  const collectionPictures = dataPictures.map((picture) => {
    return {
      nameArtist: picture.data.artist_titles,
      titlePicture: picture.data.title,
      creationDate: picture.data.date_start,
      idImage: picture.data.image_id,
    };
  });
  drawPicture(collectionPictures);
};

const contentCards = document.getElementById('collection-cards');
const template = document.getElementById('card').content;
const fragment = document.createDocumentFragment();

const drawPicture = (collection) => {
  collection.map((data) => (data.urlImage = `${URL_IMAGE.replace(':id', data.idImage)}${IMAGE_SIZE}`));
  collection.forEach((picture) => {
    template.querySelector('.card__box__container__img').setAttribute('src', picture.urlImage);
    template.querySelector('.main-card__box__container__details__title').textContent = picture.titlePicture;
    template.querySelector('.main-card__box__container__details__data').textContent = picture.creationDate;
    template.querySelector('.main-card__box__container__details__artist').textContent = picture.nameArtist;
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contentCards.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', () => {
  getDataArtPictures();
});
