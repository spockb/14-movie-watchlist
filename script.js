document.getElementById("search-btn").addEventListener("click", () => {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim();

  if (!query) return;

  document.getElementById("start-exploring").classList.add("hidden");
  document.getElementById("search").value = "";

  fetchMovies(query);
});

async function fetchMovies(query) {
  try {
    const res = await fetch(
      `http://www.omdbapi.com/?&apikey=ee04d355&s=${query}&type=movie`
    );
    const data = await res.json();

    if (data.Response === "False") {
      updateDOM("");
      return;
    }

    const movieDetails = await Promise.all(
      data.Search.map((movie) => fetchMovieDetails(movie.imdbID))
    );
    const html = movieDetails.map(renderMovieCard).join("");
    updateDOM(html);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    updateDOM("");
  }
}

async function fetchMovieDetails(imdbID) {
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=ee04d355&i=${imdbID}`
  );
  return await res.json();
}

function renderMovieCard(movie) {
  return `<div class="movie-card">
<img
  src="${movie.Poster}"
  alt="${movie.Title}"
  class="movie-img"
/>
<div class="movie-info">
  <div class="row-1">
    <h2 class="title">${movie.Title}</h2>
    <p>(${movie.Year})</p>
    <div class="rating-container">
      <span class="icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracurrentColorerCarrier"
            stroke-linecurrentcap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_icurrentColoronCarrier">
            <path
              d="m12 17.328-5.403 3.286a.75.75 0 0 1-1.12-.813l1.456-6.155-4.796-4.123a.75.75 0 0 1 .428-1.316l6.303-.517 2.44-5.835a.75.75 0 0 1 1.384 0l2.44 5.835 6.303.517a.75.75 0 0 1 .427 1.316l-4.795 4.123 1.456 6.155a.75.75 0 0 1-1.12.813L12 17.328z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </span>
      <p class="rating">${movie.Ratings[0].Value}</p>
    </div>
  </div>

  <div class="row-2">
    <p class="time">116 min</p>
    <p class="genre">${movie.Genre}</p>
    <div class="watchlist-container">
      <span class="icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <rect width="24" height="24" fill="none"></rect>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9V11H9C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H11V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H13V9ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </span>
      <p class="watchlist">Watchlist</p>
    </div>
  </div>

  <div class="row-3">
    <p class="bio">
      ${movie.Plot}
    </p>
  </div>
</div>
  </div>`;
}

function updateDOM(html) {
  document.getElementById("movies-div").innerHTML = html;
  const hasVisibleContent = html && html.trim() !== "";

  document
    .getElementById("unable-msg")
    .classList.toggle("hidden", hasVisibleContent);
}
