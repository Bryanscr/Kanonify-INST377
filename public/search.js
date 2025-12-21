const TMDB_API_KEY = "f80f86d4aa42dc68b1ff90b88dadca8e";

const searchInput = document.getElementById("searchInput");
const booksResults = document.getElementById("booksResults");
const moviesResults = document.getElementById("moviesResults");
const showsResults = document.getElementById("showsResults");
const animeResults = document.getElementById("animeResults");
const wikiResults = document.getElementById("wikiResults");

const filterBooks = document.getElementById("filterBooks");
const filterMovies = document.getElementById("filterMovies");
const filterShows = document.getElementById("filterShows");
const filterAnime = document.getElementById("filterAnime");

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    if (query !== "") {
      performSearch(query);
    }
  }
});

filterBooks.addEventListener("change", () => {
  booksResults.style.display = filterBooks.checked ? "block" : "none";
});

filterMovies.addEventListener("change", () => {
  moviesResults.style.display = filterMovies.checked ? "block" : "none";
});

filterShows.addEventListener("change", () => {
  showsResults.style.display = filterShows.checked ? "block" : "none";
});

filterAnime.addEventListener("change", () => {
  animeResults.style.display = filterAnime.checked ? "block" : "none";
});

function performSearch(query) {
  booksResults.innerHTML = "";
  moviesResults.innerHTML = "";
  showsResults.innerHTML = "";
  animeResults.innerHTML = "";
  wikiResults.innerHTML = "";

  searchBooks(query);
  searchMovies(query);
  searchShows(query);
  searchAnime(query);
  searchWikipedia(query);

  booksResults.style.display = filterBooks.checked ? "block" : "none";
  moviesResults.style.display = filterMovies.checked ? "block" : "none";
  showsResults.style.display = filterShows.checked ? "block" : "none";
  animeResults.style.display = filterAnime.checked ? "block" : "none";
}

function searchBooks(query) {
  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      booksResults.innerHTML = `
        <div class="light-divider"></div>
        <h2>Books</h2>
        <div class="light-divider"></div>
      `;

      if (!data.docs || data.docs.length === 0) {
        booksResults.innerHTML += `<p>No books found.</p>`;
        return;
      }

      data.docs.slice(0, 5).forEach(book => {
        const title = book.title || "Untitled";
        const author = book.author_name ? book.author_name[0] : "Unknown Author";

        const imageUrl = book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null;

        const link = book.key
          ? `https://openlibrary.org${book.key}`
          : "https://openlibrary.org";
          

          const card = createResultCard({
            title: title,
            subtitle: `Author: ${author}`,
            imageUrl: imageUrl,
            id: book.key,              
            type: "book",
            source: "openlibrary"
          });

        booksResults.appendChild(card);
        booksResults.appendChild(createDivider());
      });
    })
    .catch(() => {
      booksResults.innerHTML = `<p>Error loading books.</p>`;
    });
}

function searchMovies(query) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  )
    .then(res => res.json())
    .then(data => {
      moviesResults.innerHTML = `
        <h2>Movies</h2>
        <div class="light-divider"></div>
      `;

      if (!data.results || data.results.length === 0) {
        moviesResults.innerHTML += `<p>No movies found.</p>`;
        return;
      }

      data.results.slice(0, 5).forEach(movie => {
        const title = movie.title || "Untitled";
        const year = movie.release_date
          ? movie.release_date.slice(0, 4)
          : "N/A";

        const imageUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : null;

        const link = `https://www.themoviedb.org/movie/${movie.id}`;

        const card = createResultCard({
          title: title,
          subtitle: `Release Year: ${year}`,
          imageUrl: imageUrl,
          id: movie.id,
          type: "movie",
          source: "tmdb"
        });

        moviesResults.appendChild(card);
        moviesResults.appendChild(createDivider());
      });
    })
    .catch(() => {
      moviesResults.innerHTML = `<p>Error loading movies.</p>`;
    });
}

function searchShows(query) {
  fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  )
    .then(res => res.json())
    .then(data => {
      showsResults.innerHTML = `
        <h2>TV Shows</h2>
        <div class="light-divider"></div>
      `;

      if (!data.results || data.results.length === 0) {
        showsResults.innerHTML += `<p>No shows found.</p>`;
        return;
      }

      data.results.slice(0, 5).forEach(show => {
        const title = show.name || "Untitled";
        const year = show.first_air_date
          ? show.first_air_date.slice(0, 4)
          : "N/A";

        const imageUrl = show.poster_path
          ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
          : null;

        const link = `https://www.themoviedb.org/tv/${show.id}`;

        const card = createResultCard({
          title: title,
          subtitle: `First Aired: ${year}`,
          imageUrl: imageUrl,
          id: show.id,
          type: "show",
          source: "tmdb"
        });

        showsResults.appendChild(card);
        showsResults.appendChild(createDivider());
      });
    })
    .catch(() => {
      showsResults.innerHTML = `<p>Error loading shows.</p>`;
    });
}

function searchAnime(query) {
  fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      animeResults.innerHTML = `
        <h2>Anime</h2>
        <div class="light-divider"></div>
      `;

      if (!data.data || data.data.length === 0) {
        animeResults.innerHTML += `<p>No anime found.</p>`;
        return;
      }

      data.data.slice(0, 5).forEach(anime => {
        const title = anime.title;
        const type = anime.type || "Unknown";
        const imageUrl = anime.images?.jpg?.image_url || null;
        const link = anime.url;

        const card = createResultCard({
          title: title,
          subtitle: `Type: ${type}`,
          imageUrl: imageUrl,
          id: anime.mal_id,
          type: "anime",
          source: "jikan"
        });

        animeResults.appendChild(card);
        animeResults.appendChild(createDivider());
      });
    })
    .catch(() => {
      animeResults.innerHTML = `<p>Error loading anime.</p>`;
    });
}

function searchWikipedia(query) {
  fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.extract) {
        wikiResults.innerHTML = "";
        return;
      }

      wikiResults.innerHTML = `
        <h2>Wikipedia Summary</h2>
        <div class="light-divider"></div>
        <p>${data.extract}</p>
      `;
    })
    .catch(() => {
      wikiResults.innerHTML = "";
    });
}

function createResultCard({
  title,
  subtitle,
  imageUrl,
  id,
  type,
  source
}) {
  const card = document.createElement("div");
  card.className = "result-card";

  const safeImage =
    imageUrl || "https://via.placeholder.com/80x120?text=No+Image";

  card.innerHTML = `
    <img class="result-poster" src="${safeImage}" alt="${title}">
    <div class="result-info">
      <h3>${title}</h3>
      <p>${subtitle}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    const url = new URL("detailspage.html", window.location.origin);
    url.searchParams.set("id", id);
    url.searchParams.set("type", type);
    url.searchParams.set("source", source);
    url.searchParams.set("title", title);

    window.location.href = url.toString();
  });

  return card;
}

function createDivider() {
  const divider = document.createElement("div");
  divider.className = "light-divider";
  return divider;
}

const params = new URLSearchParams(window.location.search);
const query = params.get("q");

if (query) {
  searchInput.value = query;
  performSearch(query);
}





