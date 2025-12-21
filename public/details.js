const TMDB_API_KEY = "f80f86d4aa42dc68b1ff90b88dadca8e";

const posterEl = document.getElementById("detailsPoster");
const titleEl = document.getElementById("detailsTitle");
const typeEl = document.getElementById("detailsType");
const descriptionEl = document.getElementById("detailsDescription");
const reviewTextarea = document.getElementById("reviewText");
const submitReviewBtn = document.getElementById("submitReview");

const listButtons = document.querySelectorAll(".list-controls button");

const params = new URLSearchParams(window.location.search);

const id = params.get("id");
const type = params.get("type");       
const source = params.get("source");   
const title = params.get("title");

titleEl.textContent = title || "Details";

if (!id || !source) {
  descriptionEl.textContent = "Missing item information.";
  throw new Error("Missing required URL parameters");
}

if (source === "tmdb" && type === "movie") {
  fetchMovieDetails(id);
}

if (source === "tmdb" && type === "show") {
  fetchShowDetails(id);
}

if (source === "jikan" && type === "anime") {
  fetchAnimeDetails(id);
}

if (source === "openlibrary" && type === "book") {
  fetchBookDetails(id);
}

function fetchMovieDetails(id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      titleEl.textContent = data.title;
      typeEl.textContent = "Movie";

      descriptionEl.textContent =
        data.overview || "No description available.";

      posterEl.src = data.poster_path
        ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
        : "https://via.placeholder.com/200x300?text=No+Image";
    })
    .catch(() => {
      descriptionEl.textContent = "Error loading movie details.";
    });
}

function fetchShowDetails(id) {
  fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      titleEl.textContent = data.name;
      typeEl.textContent = "TV Show";

      descriptionEl.textContent =
        data.overview || "No description available.";

      posterEl.src = data.poster_path
        ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
        : "https://via.placeholder.com/200x300?text=No+Image";
    })
    .catch(() => {
      descriptionEl.textContent = "Error loading show details.";
    });
}

function fetchAnimeDetails(id) {
  fetch(`https://api.jikan.moe/v4/anime/${id}`)
    .then(res => res.json())
    .then(data => {
      const anime = data.data;

      titleEl.textContent = anime.title;
      typeEl.textContent = "Anime";

      descriptionEl.textContent =
        anime.synopsis || "No description available.";

      posterEl.src =
        anime.images?.jpg?.large_image_url ||
        "https://via.placeholder.com/200x300?text=No+Image";
    })
    .catch(() => {
      descriptionEl.textContent = "Error loading anime details.";
    });
}

function fetchBookDetails(id) {
  fetch(`https://openlibrary.org${id}.json`)
    .then(res => res.json())
    .then(data => {
      titleEl.textContent = data.title;
      typeEl.textContent = "Book";

      if (typeof data.description === "string") {
        descriptionEl.textContent = data.description;
      } else if (data.description?.value) {
        descriptionEl.textContent = data.description.value;
      } else {
        descriptionEl.textContent = "No description available.";
      }

      posterEl.src = data.covers?.length
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        : "https://via.placeholder.com/200x300?text=No+Image";
    })
    .catch(() => {
      descriptionEl.textContent = "Error loading book details.";
    });
}

function loadOriginalSource(title, type) {
    const baseQuery =
    type === "movie" ? `${title} film` :
    type === "show"  ? `${title} television series` :
    type === "anime" ? `${title} manga` :
    title;

  const searchUrl =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query&list=search&srsearch=${encodeURIComponent(baseQuery)}` +
    `&format=json&origin=*`;

  fetch(searchUrl)
    .then(res => res.json())
    .then(searchData => {
      const results = searchData?.query?.search;
      if (!results || results.length === 0) {
        hideOriginalSource();
        return;
      }

      const pageTitle = results[0].title;

      return fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
      );
    })
    .then(res => {
      if (!res) return;
      return res.json();
    })
    .then(data => {
      if (!data || !data.extract) {
        hideOriginalSource();
        return;
      }

      let introText = "";
      switch (type) {
        case "anime":
          introText =
            "This anime is adapted from an original manga series. Below is background information about the source material:";
          break;
        case "show":
          introText =
            "This television series is adapted from existing source material. Below is background information about the original work:";
          break;
        case "movie":
          introText =
            "This film is based on characters, stories, or themes from an original written work. Below is background information about the source:";
          break;
        case "book":
          introText =
            "This book is the original source material. Below is additional background information:";
          break;
        default:
          introText = "Original source information:";
      }

      document.getElementById("originalSourceText").innerHTML = `
        <strong>${introText}</strong><br><br>
        ${data.extract}
      `;

      document.getElementById("originalSourceLink").href =
        data.content_urls.desktop.page;
    })
    .catch(() => {
      hideOriginalSource();
    });
}  

function hideOriginalSource() {
  const section = document.querySelector(".original-source-section");
  if (section) {
    section.style.display = "none";
  }
}

if (title && type) {
    loadOriginalSource(title, type);
  }

listButtons.forEach(button => {
  button.addEventListener("click", () => {
    const listName = button.dataset.list;
    addToList(listName);
  });
});

function addToList(listName) {
    const stored = JSON.parse(localStorage.getItem("kanonifyLists")) || {
      watching: [],
      reading: [],
      completed: []
    };
  
    if (
      listName !== "completed" &&
      stored.completed.some(item => item.id === id)
    ) {
      alert("This item is already completed.");
      return;
    }
  
    const item = {
      id,
      title,
      type,
      source
    };

    if (stored[listName].some(entry => entry.id === id)) {
      alert("This item is already in that list.");
      return;
    }
  
    stored[listName].push(item);
    localStorage.setItem("kanonifyLists", JSON.stringify(stored));
  
    alert(`Added "${title}" to ${listName}`);
  }
  

const stars = document.querySelectorAll(".stars span");
const ratingNote = document.querySelector(".rating-note");

let selectedRating = 0;

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    selectedRating = stars.length - index;
    updateStars(selectedRating);

    ratingNote.textContent = `You rated this ${selectedRating}/5`;
  });
});

function updateStars(rating) {
  stars.forEach((star, index) => {
    if (stars.length - index <= rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

submitReviewBtn.addEventListener("click", async () => {
    if (!selectedRating) {
      alert("Please select a rating first.");
      return;
    }
  
    const reviewText = reviewTextarea.value.trim();
  
    try {
      const res = await fetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          media_type: type,
          rating: selectedRating,
          review_text: reviewText,
          poster_url: posterEl.src
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to submit review");
      }
  
      alert("Review submitted!");
      reviewTextarea.value = "";
      loadReviewsForTitle();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  });

const allowedListsByType = {
    movie: ["watching", "completed"],
    show: ["watching", "completed"],
    anime: ["watching", "completed"],
    book: ["reading", "completed"]
  };

  async function loadReviewsForTitle() {
    const res = await fetch("/reviews");
    const reviews = await res.json();
  
    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = "";
  
    const filtered = reviews.filter(r => r.title === title);
  
    if (filtered.length === 0) {
      reviewsList.innerHTML = "<p>No reviews yet.</p>";
      return;
    }
  
    filtered.forEach(review => {
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `
        <strong>${"★".repeat(review.rating)}</strong>
        <p>${review.review_text || ""}</p>
      `;
      reviewsList.appendChild(div);
    });
  }

  function updateListButtons() {
    const allowedLists = allowedListsByType[type] || [];
  
    listButtons.forEach(button => {
      const listName = button.dataset.list;
  
      if (!allowedLists.includes(listName)) {
        button.disabled = true;
        button.style.opacity = "0.4";
        button.title = "Not applicable for this type";
      }
    });
  }

  updateListButtons();
  loadReviewsForTitle();
