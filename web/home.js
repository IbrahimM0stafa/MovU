const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODQ1M2NmZDExNjc0YzU2ODNmOWJkN2IwYjJiMzM3MiIsInN1YiI6IjY1ZmNkNjNmNzcwNzAwMDE3YzA5ODFiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9MUqCTNqKGkkXrkC7VOqb_AEc-9aUleD3lR6CDQcayc'
    }
  };



const nowShowing = () => {
  fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
  .then(response => response.json())
  .then(response => {
      const data = response.results;
      
      // document.getElementsByClassName("movies")[0].innerHTML = banner;
      let movies = [];
      data.map((item) => {
          const name = item.original_title;
          const imageUrl = "https://image.tmdb.org/t/p/w500/" + item.poster_path;
          let avgRate = item.vote_average;
          const movieId= item.id;
          avgRate = Math.round(avgRate * 10) / 10;
          movies.push({name, imageUrl, avgRate,movieId});

      });
      let counter = 0;
      nowShowingfn(movies, counter);


      document.getElementById("btn-right").addEventListener('click', () => {
          if (movies.length - counter >= 5) {
              counter += 5;
              console.log("counterRight is "+counter);
              nowShowingfn(movies, counter);
          }
      });

      document.getElementById("btn-left").addEventListener('click', () => {
          if (counter >= 5) {
              counter -= 5;
              console.log("counterleft is "+counter);
              nowShowingfn(movies, counter);
          }
      });
       // Attach event listener to movu buttons
  })
  .catch(err => console.error(err));
}


const topRated = () => {
  fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
  .then(response => response.json())
  .then(response => {
      const data = response.results;
      
      // document.getElementsByClassName("movies")[0].innerHTML = banner;
      let movies = [];
      data.map((item) => {
          const name = item.original_title;
          const imageUrl = "https://image.tmdb.org/t/p/w500/" + item.poster_path;
          const movieId= item.id;
          let avgRate = item.vote_average;
          avgRate = Math.round(avgRate * 10) / 10;
          movies.push({name, imageUrl, avgRate,movieId});

      });
      let counter = 0;
      topRatedfn(movies, counter);


      document.getElementById("btn-right2").addEventListener('click', () => {
          if (movies.length - counter >= 5) {
              counter += 5;
              console.log("counterRight is "+counter);
              topRatedfn(movies, counter);
          }
      });

      document.getElementById("btn-left2").addEventListener('click', () => {
          if (counter >= 5) {
              counter -= 5;
              console.log("counterleft is "+counter);
              topRatedfn(movies, counter);
          }
      });
  })
  .catch(err => console.error(err));
}


const upComing = () => {
  fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
  .then(response => response.json())
  .then(response => {
      console.log(response.results);
      const data = response.results;
      
      // document.getElementsByClassName("movies")[0].innerHTML = banner;
      let movies = [];
      data.map((item) => {
          const name = item.original_title;
          const imageUrl = "https://image.tmdb.org/t/p/w500/" + item.poster_path;
          const movieId= item.id;
          let avgRate = item.vote_average;
          avgRate = Math.round(avgRate * 10) / 10;
          movies.push({name, imageUrl, avgRate,movieId});

      });
      let counter = 0;
      upComingfn(movies, counter);


      document.getElementById("btn-right3").addEventListener('click', () => {
          if (movies.length - counter >= 5) {
              counter += 5;
              console.log("counterRight is "+counter);
              upComingfn(movies, counter);
          }
      });

      document.getElementById("btn-left3").addEventListener('click', () => {
          if (counter >= 5) {
              counter -= 5;
              console.log("counterleft is "+counter);
              upComingfn(movies, counter);
          }
      });
  })
  .catch(err => console.error(err));
}

const searching = (searchText) => {
    fetch('https://api.themoviedb.org/3/search/multi?query='+searchText+'&include_adult=false&language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => {
        console.log(response.results);
        const data = response.results;

        const searchResultDiv = document.getElementById('search_result');

    
        // Clear previous search results
        searchResultDiv.innerHTML = '';
        const movieContainers = document.querySelectorAll('.search_bar');
        let movies = [];
        data.map((item) => {
            const ID = item.id; 
            const name = item.original_title ? item.original_title : item.name;   
            var imageUrl = (item.poster_path != null) ? item.poster_path : item.profile_path;
            imageUrl = "https://image.tmdb.org/t/p/w500/" + imageUrl;
            var date = item.release_date;
            if(date){
                date = date.substring(0, 4);
            }
            var mediaType = item.media_type;
            movies.push({name, imageUrl, date, mediaType,ID});
        });


        if(searchText == ""){
            searchResultDiv.style.border = '0px';
            searchResultDiv.style.padding = '0px';
        }
        else{
            searchResultDiv.style.border = '2px solid black';
            searchResultDiv.style.padding = '5px';
        }
        

        for (let i = 0; i < Math.min(4, movies.length); i++) {
            const movie = movies[i];

            const movieDiv = document.createElement('div');
            movieDiv.setAttribute('id', 'search_list');

            const image = document.createElement('img');
            image.src = movie.imageUrl;
            image.width = 50;
            image.height = 70;

            const movieDetailsDiv = document.createElement('div');

            const movieNameDiv = document.createElement('div');
            movieNameDiv.textContent = movie.name;

            
            const mediaTypeDiv = document.createElement('div');
            mediaTypeDiv.textContent = "type: " + movie.mediaType;

            const dateDiv = document.createElement('div');
            dateDiv.textContent = movie.date;

            // overviewDiv.style.fontSize = 'small';

            movieDetailsDiv.appendChild(movieNameDiv);
            movieDetailsDiv.appendChild(dateDiv);
            movieDetailsDiv.appendChild(mediaTypeDiv);

            movieDiv.appendChild(image);
            movieDiv.appendChild(movieDetailsDiv);

            movieDiv.addEventListener('click', () => {
                // Store the selected movie ID in local storage
                //localStorage.setItem('selectedMovieId', movie.ID);

                if (movie.mediaType === 'movie') {
                    window.location.href = 'MoviePage.html'; // Redirect to movie page
                    localStorage.setItem('selectedMovieId', movie.ID);
                } else {
                    window.location.href = 'artist.html'; // Redirect to artist page
                    localStorage.setItem('selectedArtistId', movie.ID);
                }
            });

            searchResultDiv.appendChild(movieDiv);

            const hr = document.createElement('hr');
            searchResultDiv.appendChild(hr);
        }
    })
}







function topRatedfn(movies, start) {
  const end = Math.min(start + 5, movies.length);
  console.log("star :" +start);
  console.log("end :"+ end);
  let moviesHTML = "";


  for (let i = start; i < end; i++) {
    const movie = "<div class='edit_movie' data-id='" + movies[i].movieId + "'><div class='edit_movie_img'> <img src='" + movies[i].imageUrl + "' alt='Movie Poster'> </div>" +
      "<div class='star'><i class='fa-solid fa-star' style='color: #FFD43B;'></i> <p>" + movies[i].avgRate + "</p></div><button>" + movies[i].name + "</button></div>";
    moviesHTML += movie;
  }


  document.getElementsByClassName("moviesList")[0].innerHTML = moviesHTML;
  
  // Add event listener to movie container
  const movieContainers = document.querySelectorAll(".edit_movie");
    movieContainers.forEach(container => {
      container.addEventListener("click", () => {
        const movieID = container.getAttribute("data-id");
        console.log("Clicked movie ID: ", movieID);
        localStorage.setItem("selectedMovieId", movieID);
        // Redirect to movie page
        window.location.href = "MoviePage.html"; // Change "movie_page.html" to your actual movie page URL
      });
    });
}

function nowShowingfn(movies, start) {
  const end = Math.min(start + 5, movies.length);
  console.log("star :" +start);
  console.log("end :"+ end);
  let moviesHTML = "";


  for (let i = start; i < end; i++) {
    const movie = "<div class='edit_movie' data-id='" + movies[i].movieId + "'><div class='edit_movie_img'> <img src='" + movies[i].imageUrl + "' alt='Movie Poster'> </div>" +
      "<div class='star'><i class='fa-solid fa-star' style='color: #FFD43B;'></i> <p>" + movies[i].avgRate + "</p></div><button>" + movies[i].name + "</button></div>";
    moviesHTML += movie;
  }

  document.getElementsByClassName("nowShowing")[0].innerHTML = moviesHTML;

  const movieContainers = document.querySelectorAll(".edit_movie");
    movieContainers.forEach(container => {
      container.addEventListener("click", () => {
        const movieID = container.getAttribute("data-id");
        console.log("Clicked movie ID: ", movieID);
        localStorage.setItem("selectedMovieId", movieID);
        // Redirect to movie page
        window.location.href = "MoviePage.html"; // Change "movie_page.html" to your actual movie page URL
      });
    });
}

function upComingfn(movies, start) {
    const end = Math.min(start + 5, movies.length);
    console.log("start :" + start);
    console.log("end :" + end);
    let moviesHTML = "";
  
    for (let i = start; i < end; i++) {
      const movie = "<div class='edit_movie' data-id='" + movies[i].movieId + "'><div class='edit_movie_img'> <img src='" + movies[i].imageUrl + "' alt='Movie Poster'> </div>" +
        "<div class='star'><i class='fa-solid fa-star' style='color: #FFD43B;'></i> <p>" + movies[i].avgRate + "</p></div><button>" + movies[i].name + "</button></div>";
      moviesHTML += movie;
    }
    document.getElementsByClassName("upcomingList")[0].innerHTML = moviesHTML;
  
    // Add event listener to movie container
    const movieContainers = document.querySelectorAll(".edit_movie");
    movieContainers.forEach(container => {
      container.addEventListener("click", () => {
        const movieID = container.getAttribute("data-id");
        console.log("Clicked movie ID: ", movieID);
        localStorage.setItem("selectedMovieId", movieID);
        // Redirect to movie page
        window.location.href = "MoviePage.html"; // Change "movie_page.html" to your actual movie page URL
      });
    });
}


// var searchText = ""
/* get the data from the search */
function captureString() {
    const searchText = document.getElementById("inputField").value;
    
    searching(searchText);
}





nowShowing();
topRated();
upComing();


var items = ["Apple", "Banana", "Orange", "Mango", "Pineapple", "Grapes"];

function searchItems() {
    var input = document.getElementById('searchInput').value.toLowerCase();
    var results = document.getElementById('searchResults');
    results.innerHTML = ''; // Clear previous results
    
    // Filter items based on input
    var filteredItems = items.filter(function(item) {
        return item.toLowerCase().includes(input);
    });
    
    // Display filtered items
    filteredItems.forEach(function(item) {
        var li = document.createElement('li');
        li.textContent = item;
        results.appendChild(li);
    });
}
document.addEventListener('DOMContentLoaded', function() {
  
  var aboutUs = document.querySelector('.aboutUs');
  var profile = document.querySelector('.profile');
  aboutUs.addEventListener('click', function() {
      
      window.location.href = 'AboutUs.html';
  });
  profile.addEventListener('click', function() {
      
      window.location.href = 'login.html';
  });
});

