
const axios = require('axios').default;

export default class ApiService{
  constructor() {
    this.searchQuery = ' '
    this.page = 1
  }
 
  
  fetchPic() {
      
    const url = `https://pixabay.com/api/?key=30737585-7687c43aebcf0b54a5b307985&q=${this.searchQuery}&type=photo&orientation=horizontal&page=${this.page}&per_page=40&safesearch=true`;
  
    //  return fetch(url)
    return axios.get(url)
      .then(r => r)
       .then(data => {
         this.incrementPage()
         return data
       }
       ) 
  }

  incrementPage() {
    this.page+=1
  }
  resetPage() {
    this.page=1
  }
  
  get querry() {
    return this.searchQuery
  } 

  set querry(newSearchQuery) {
    this.searchQuery = newSearchQuery
  }
}


