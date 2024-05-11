const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTkxMGY4NzdkMjNiMjNmMzY2MDM2ZGQ4MzVjMTU5ZCIsInN1YiI6IjY2MTg4YTIxNjZlNDY5MDE2NWJiZmIwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cHK5BqLZ3McyiHlj3_FMnUbbqQIGHHBdUP7BP93Qx_I'
    }
};
const personId = localStorage.getItem('selectedArtistId');
const Artist = () => {
    // const personId = localStorage.getItem('selectedArtistId');
    if (personId) {
        fetch('https://api.themoviedb.org/3/person/' + personId + '?language=en-US', options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const name = data.name;
                const imageUrl = "https://image.tmdb.org/t/p/w500/" + data.profile_path;
                const biography = data.biography;

                const artistContainer = document.querySelector('.artistContainer');
                artistContainer.innerHTML = `
                    <div class="box">
                        <div class="content">
                            <img src="${imageUrl}" alt="" class="image">
                            <div class="details"> 
                                <h2>${name}</h2>
                                <p>${biography}</p>
                            </div>
                        </div>
                    </div>
                `;
            })
            .catch(err => console.error(err));
    } else {
        console.error('No person ID found in localStorage.');
    }
};

const Filmography = () => {
    // const personId = localStorage.getItem('selectedArtistId');
    if (personId) {
        fetch('https://api.themoviedb.org/3/person/' + personId + '/combined_credits?language=en-US', options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const cast = data.cast;
                let movies = cast.map(item => ({
                    name: item.original_title,
                    imageUrl: "https://image.tmdb.org/t/p/w500/" + item.poster_path,
                    avgRate: Math.round(item.vote_average * 10) / 10,
                    id:item.id
                }));
                let counter = 0;
                Filmographyfn(movies, counter);
                document.getElementById("btn-right").addEventListener('click', () => {
                    if (movies.length - counter >= 5) {
                        counter += 5;
                        Filmographyfn(movies, counter);
                    }
                });
                document.getElementById("btn-left").addEventListener('click', () => {
                    if (counter >= 5) {
                        counter -= 5;
                        Filmographyfn(movies, counter);
                    }
                });
            })
            .catch(err => console.error(err));
    } else {
        console.error('No person ID found in localStorage.');
    }
};

function Filmographyfn(movies, start) {
    const end = Math.min(start + 5, movies.length);
    let moviesHTML = "";
    for (let i = start; i < end; i++) {
        const movie = `<div class='edit_movie' data-id='${movies[i].id}'><img src='${movies[i].imageUrl}' alt='Movie Poster'>
            <div class='star'><i class='fa-solid fa-star' style='color: #FFD43B;'></i> <p>${movies[i].avgRate}</p></div>
            <button>${movies[i].name}</button></div>`;
        moviesHTML += movie;
    }
    document.querySelector(".Filmography").innerHTML = moviesHTML;

    // Add event listener to movie containers
    const movieContainers = document.querySelectorAll(".edit_movie");
    movieContainers.forEach(container => {
        container.addEventListener("click", () => {
            const movieID = container.getAttribute("data-id");
            console.log("Clicked movie ID: ", movieID);
            localStorage.setItem("selectedMovieId", movieID);
            
            // Redirect to movie page
            window.location.href = "MoviePage.html"; // Change "MoviePage.html" to your actual movie page URL
        });
    });
}


Artist();
Filmography();
