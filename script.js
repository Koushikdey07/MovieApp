// Using TMDB Api

const API_KEY = 'api_key=da317e580934b67f4b50f65b8261f408';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + '/search/movie?'+ API_KEY;

const genres = [     
          {
            "id": 28,
            "name": "Action"
          },
          {
            "id": 12,
            "name": "Adventure"
          },
          {
            "id": 16,
            "name": "Animation"
          },
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 80,
            "name": "Crime"
          },
          {
            "id": 99,
            "name": "Documentary"
          },
          {
            "id": 18,
            "name": "Drama"
          },
          {
            "id": 10751,
            "name": "Family"
          },
          {
            "id": 14,
            "name": "Fantasy"
          },
          {
            "id": 36,
            "name": "History"
          },
          {
            "id": 27,
            "name": "Horror"
          },
          {
            "id": 10402,
            "name": "Music"
          },
          {
            "id": 9648,
            "name": "Mystery"
          },
          {
            "id": 10749,
            "name": "Romance"
          },
          {
            "id": 878,
            "name": "Science Fiction"
          },
          {
            "id": 10770,
            "name": "TV Movie"
          },
          {
            "id": 53,
            "name": "Thriller"
          },
          {
            "id": 10752,
            "name": "War"
          },
          {
            "id": 37,
            "name": "Western"
          }
]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsElement = document.getElementById('tags');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var previousPage =3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = [];

setGenre();

function setGenre(){
    tagsElement.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) =>{
                        if(id == genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        tagsElement.append(t);
    })
}

function highlightSelection(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag=>{
        tag.classList.remove('highlight');
    })
    clearBtn();
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id => {
            const highlightTag = document.getElementById(id);
            highlightTag.classList.add('highlight');
        })
    }

    
}

getMovies(API_URL);

function getMovies(url){
  lastUrl = url;
    fetch(url).then(res=>res.json()).then(data =>{
        console.log(data);
        if(data.results != 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            previousPage = currentPage -1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              previous.classList.add('disabled');
              next.classList.remove('disabled');
            }else if(currentPage >= totalPages){
              previous.classList.remove('disabled');
              next.classList.add('disabled');  
            }else{
              previous.classList.remove('disabled');
              next.classList.remove('disabled'); 
            }

            tagsElement.scrollIntoView({behaviour : 'smooth'});

        }else{
            main.innerHTML = '<h1 class = "no-results">No Reults Found</h1>';
            // alert('No Result Found...');
        }
    })
}

function showMovies(data){
    main.innerHTML = '';
    data.forEach(movie => {
        const{title,poster_path,vote_average,overview} = movie;
        const movieElement = document.createElement('div'); 
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
        <img src="${poster_path? IMAGE_URL+poster_path: "/Images/Broken_Image.jpg"}" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
        </div>

        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>`

        main.appendChild(movieElement);
    });
}

function getColor(vote){
    if(vote >= 8){
        return 'green';
    }else if(vote >= 5){
        return 'orange';
    }else{
        return 'red';
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm){
        getMovies(SEARCH_URL+'&query='+searchTerm);
    }else{
        getMovies(API_URL);
    }

})

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');

    }else{
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click',()=>{
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsElement.append(clear);
    }
}

previous.addEventListener('click',() => {
  if(previousPage > 0){
    pageCall(previousPage);
  }
})

next.addEventListener('click',() => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length - 1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page=' + page;
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a =  key.join('=');
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] + '?' + b;
    getMovies(url);
  }
}