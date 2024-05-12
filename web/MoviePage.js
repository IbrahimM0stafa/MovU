const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDE5NmNiNDlhYzQ0MThjYTAyM2RjMzBkZTRlMjEzMCIsInN1YiI6IjY2MWQ3MzFkOTMxZWExMDE4NjY1ZTI0OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e6B-i5q52nnJ5GvqqeYwPPBrpTJ3RKewNxFpuY5mA_Q'
    }
  };
  const movieId= localStorage.getItem('selectedMovieId');
  

  const updateMovieDetails = (title, imageUrl, overview) => {
  
    // Update movie title
    document.querySelector('.movie-title').innerText = title;

    // Update background image
    document.querySelector('.banner').style.backgroundImage = `url(${imageUrl})`;

    // Update movie overview
    document.querySelector('.banner .content p').innerText = overview;
};

const fetchMovieDetails = () => {
    fetch('https://api.themoviedb.org/3/movie/'+movieId+'?language=en-US', options)
    .then(response => response.json())
    .then(response => {
        const movieData = response;
        const title = movieData.original_title;
        const imageUrl = "https://image.tmdb.org/t/p/w500/" + movieData.backdrop_path;
        const overview = movieData.overview;
        
        // Call the function to update movie details
        updateMovieDetails(title, imageUrl, overview);
        if (response.genres && response.genres.length > 0) {
            document.querySelector('.banner h4 span:nth-child(4)').textContent = response.genres[0].name;
        }
        // Replace the span holding 5 seasons with the movie duration from the API
        document.querySelector('.banner h4 span:nth-child(3)').textContent = response.runtime + ' minutes';
        // Replace the span holding 2008 with the movie release date from the API
        document.querySelector('.banner h4 span:nth-child(1)').textContent = response.release_date.substring(0, 4);

    })
    .catch(err => console.error(err));
};

const fetchAgeRestriction = () => {
    fetch('https://api.themoviedb.org/3/movie/' + movieId + '/release_dates', options)
        .then(response => response.json())
        .then(response => {
            // Find the certification for the desired region (e.g., 'US')
            const certification = response.results.find(result => result.iso_3166_1 === 'US');
            
            if (certification && certification.release_dates.length > 0) {
                // Extract the certification value (e.g., 'PG-13')
                const ageCertification = certification.release_dates[0].certification;
                
                // Map age ratings to numbers
                const ageRatingToNumber = {
                    "G": "0+",
                    "PG": "10+",
                    "PG-13": "13+",
                    "R": "18+",
                    "NC-17": "18+"
                    // Add more ratings and their numerical equivalents as needed
                };
                
                // Convert age rating to number
                const ageNumber = ageRatingToNumber[ageCertification];
                
                // Update the span holding the age restriction
                const ageSpan = document.querySelector('.banner h4 span:nth-child(2)');
                ageSpan.textContent = ageNumber;
                ageSpan.style.background = '#e50914';
                ageSpan.style.color = '#fff';
                ageSpan.style.padding = '0 8px';
                ageSpan.style.display = 'inline-block';
                ageSpan.style.borderRadius = '2px';
                ageSpan.style.margin = '5px 5px 5px 5px';
                
            }
        })
        .catch(err => console.error(err));
};



const fetchCast = () => {
    
    fetch('https://api.themoviedb.org/3/movie/'+movieId+'/credits?language=en-US', options)
    .then(response => response.json())
    .then(response => {
        const cast = response.cast;
        const actors = cast.slice(0, 5);
        
        const castContainer = document.querySelector('.cast');
        
        // Clear existing cast links
        castContainer.innerHTML = '';
        
        actors.forEach(actor => {
            const actorLink = document.createElement('a');
            actorLink.textContent = actor.name;
            actorLink.href = '#';
            actorLink.addEventListener('click', () => {
                // Store the cast ID in local storage when clicked
                localStorage.setItem('selectedArtistId', actor.id);
                console.log(actor.id);
                window.location.href = 'artist.html';
            });
            
            castContainer.appendChild(actorLink);
            
            // Add space between links
            const space = document.createTextNode(', ');
            castContainer.appendChild(space);
        });
    })
    .catch(err => console.error(err));
};


document.addEventListener('DOMContentLoaded', function() {
    
    var logo = document.querySelector('.logo');
    var home = document.querySelector('.home');
    var aboutUs = document.querySelector('.aboutUs');
    var login = document.querySelector('.login');
    logo.addEventListener('click', function() {
        
        window.location.href = 'home.html';
    });
    home.addEventListener('click', function() {
        
        window.location.href = 'home.html';
    });
    aboutUs.addEventListener('click', function() {
        
        window.location.href = 'AboutUs.html';
    });
    login.addEventListener('click', function() {
        
        window.location.href = 'login.html';
    });
});





console.log(movieId);

// Call the fetchMovieDetails function to update movie details when the page loads
fetchMovieDetails();
fetchCast();
fetchAgeRestriction();
searchAndStore();