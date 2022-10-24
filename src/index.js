import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ApiService from "./server.js";
import Notiflix from 'notiflix';
import throttle from "lodash.throttle";

 

const DELAY = 300;
const galleryEls = document.querySelector('.gallery'); 
const newApiService = new ApiService();

const refs = {
    searchForm: document.querySelector('#search-form'),
  loadMore: document.querySelector('.load-more')
  
}

refs.searchForm.addEventListener("submit", onSearch);
// refs.loadMore.addEventListener('click', onLoadMore)
 

function onSearch(e) {
    e.preventDefault();
    
  newApiService.querry =  e.target.elements.searchQuery.value.trim()
   newApiService.resetPage()
   
  newApiService.fetchPic().then(data => {

    if (newApiService.querry ==="" || data.data.total === 0 ) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again."); 
      return
      }
    else {
        Notiflix.Notify.info(`Hooray! We found ${data.data.total} images.`);
        destroyMarkup(galleryEls)
     }  
        
    const markupGaleryEls = createMarkupGalleryEls(data.data.hits) 
        galleryEls.insertAdjacentHTML('beforeend', markupGaleryEls)
        let lightbox = new SimpleLightbox('.gallery__item', {
           
        });
   })

}
function onLoadMore() {


  newApiService.fetchPic().then(data => {

  const markupGaleryEls = createMarkupGalleryEls(data.data.hits) 
  galleryEls.insertAdjacentHTML('beforeend', markupGaleryEls)
  let lightbox = new SimpleLightbox('.gallery__item');
    }) 
}

function createMarkupGalleryEls(e) {
    return e.map(({ webformatURL, largeImageURL, tags, likes, views, comments,downloads }) => {
        return `
        <div class="photo-card">
         <a class="gallery__item"
        href= "${largeImageURL}">
        <div class = "wrapper-img">
  <img src="${webformatURL}"  alt="${tags}" loading="lazy" />
</div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <p>${likes}</p>
    </p>
    <p class="info-item">
      <b>Views</b> <p>${views}</p>
    </p>
    <p class="info-item">
      <b>Comments</b><p>${comments}</p>
    </p>
    <p class="info-item">
      <b>Downloads</b><p>${downloads}</p>
    </p>
  </div>
</div>
  `
})
.join('');
}

function destroyMarkup(e) {
    e.innerHTML = "";
}

window.addEventListener("scroll", throttle(onLoadScroll, DELAY))

function onLoadScroll() {

  const documentRctgl = document.documentElement.getBoundingClientRect()

  window.scrollBy({ behavior: "smooth", });
  
  if (documentRctgl.bottom < document.documentElement.clientHeight + 400) {
    onLoadMore()
    
     if(documentRctgl.bottom < document.documentElement.clientHeight+5 ) {
   Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  }
  }
}



