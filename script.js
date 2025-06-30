document.getElementById("search-btn").addEventListener("click", () => {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim();

  if (!query) return;

  document.getElementById("start-exploring").classList.add("hidden");
  searchInput.value = "";

  fetchMovies(query);
});

document.getElementById("watchlist-btn").addEventListener("click", () => {
  renderWatchlist();
  document.getElementById("start-exploring").classList.add("hidden");
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".watchlist-container");
  if (!btn) return;

  if (btn) {
    let watchlist = getWatchlist();
    const imdbID = btn.dataset.imdbid;
    const isSaved = watchlist.includes(imdbID);

    if (isSaved) {
      watchlist = watchlist.filter((id) => id !== imdbID);
      btn.querySelector(
        ".icon"
      ).innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z" fill="currentColor"></path> </g></svg>`;
      btn.querySelector(".watchlist").textContent = "Add to Watchlist";
    } else {
      watchlist.push(imdbID);
      btn.querySelector(
        ".icon"
      ).innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 10L1 6L15 6V10L1 10Z" fill="currentColor"></path> </g></svg>`;
      btn.querySelector(".watchlist").textContent = "Remove from Watchlist";
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
});

function getWatchlist() {
  const local = localStorage.getItem("watchlist");
  return local ? JSON.parse(local) : [];
}
async function fetchMovies(query) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?&apikey=ee04d355&s=${query}&type=movie`
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
    `https://www.omdbapi.com/?apikey=ee04d355&i=${imdbID}`
  );
  return res.json();
}

function renderMovieCard(movie) {
  const watchlist = getWatchlist();
  const isSaved = watchlist.includes(movie.imdbID);

  const watchlistText = isSaved ? "Remove from Watchlist" : "Add to Watchlist";
  const watchlistIcon = isSaved
    ? `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 10L1 6L15 6V10L1 10Z" fill="currentColor"></path> </g></svg>`
    : `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z" fill="currentColor"></path> </g></svg>`;

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
      <p class="rating">${movie.imdbRating}</p>
    </div>
  </div>

  <div class="row-2">
    <p class="time">116 min</p>
    <p class="genre">${movie.Genre}</p>
    <div class="watchlist-container" data-imdbid="${movie.imdbID}">
      <span class="icon">
        ${watchlistIcon}
      </span>
      <p class="watchlist">${watchlistText}</p>
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

async function renderWatchlist() {
  const watchlist = getWatchlist();

  const movieDetails = await Promise.all(
    watchlist.map((imdbID) => fetchMovieDetails(imdbID))
  );
  const html = movieDetails.map(renderMovieCard).join("");
  updateDOM(html);
}

function updateDOM(html) {
  document.getElementById("movies-div").innerHTML = html;
  const hasVisibleContent = html && html.trim() !== "";

  document
    .getElementById("unable-msg")
    .classList.toggle("hidden", hasVisibleContent);
}
