const TMDB_API_KEY = "f80f86d4aa42dc68b1ff90b88dadca8e";

const trendingGrid = document.getElementById("trendingGrid");
const latestReviews = document.getElementById("latestReviews");
const searchInput = document.getElementById("homeSearchInput");

let trendingMixed = [];

function renderTrending() {
    trendingGrid.innerHTML = "";
    trendingMixed = [];

    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        data.results
          .filter(item => item.media_type === "movie" || item.media_type === "tv")
          .slice(0, 4)
          .forEach(item => {
            trendingMixed.push({
              title: item.title || item.name,
              type: item.media_type === "tv" ? "show" : "movie",
              source: "tmdb",
              id: item.id,
              image: item.poster_path
                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                : null
            });
          });
  
        renderAnimeTrending();
      })
      .catch(() => {
        trendingGrid.innerHTML = "<p>Failed to load trending content.</p>";
      });
  }

  function renderAnimeTrending() {
    fetch("https://api.jikan.moe/v4/top/anime")
      .then(res => res.json())
      .then(data => {
        data.data.slice(0, 4).forEach(anime => {
          trendingMixed.push({
            title: anime.title,
            type: "anime",
            source: "jikan",
            id: anime.mal_id,
            image: anime.images?.jpg?.image_url || null
          });
        });
  
        drawTrendingCards();
      })
      .catch(() => {
        drawTrendingCards();
      });
  }
  
  function drawTrendingCards() {
    trendingGrid.innerHTML = "";
  
    trendingMixed.forEach(item => {
      const card = document.createElement("div");
      card.className = "card clickable";
  
      card.innerHTML = `
        <img src="${item.image || "https://via.placeholder.com/200x300"}" />
        <div class="card-footer">
          <strong>${item.title}</strong>
          <span>${formatType(item.type)}</span>
        </div>
      `;
  
      card.addEventListener("click", () => {
        const url = new URL("detailspage.html", window.location.origin);
        url.searchParams.set("id", item.id);
        url.searchParams.set("type", item.type);
        url.searchParams.set("source", item.source);
        url.searchParams.set("title", item.title);
  
        window.location.href = url.toString();
      });
  
      trendingGrid.appendChild(card);
    });
  }
  
  function renderLatestReviews(reviews) {
    const container = document.getElementById("latestReviews");
    container.innerHTML = "";
  
    if (!reviews || reviews.length === 0) {
      container.innerHTML = `<p class="no-reviews">No reviews yet. Be the first!</p>`;
      return;
    }
  
    reviews.slice(0, 5).forEach(review => {
      const card = document.createElement("div");
      card.className = "card review-card clickable";
  
      const reviewedAt = review.created_at
        ? dayjs(review.created_at).fromNow()
        : "";
  
      card.innerHTML = `
        <img 
          src="${review.poster_url || "https://via.placeholder.com/200x300"}"
          alt="${review.title}"
        />
        <div class="card-footer">
          <strong>${review.title}</strong>
          <span class="stars">
            ${"★".repeat(review.rating)} · ${reviewedAt}
          </span>
          <div class="review-text">
            ${review.review_text || ""}
          </div>
        </div>
      `;
  
      container.appendChild(card);
    });
  }
  
  fetch("/reviews")
  .then(res => res.json())
  .then(data => renderLatestReviews(data));

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    if (!query) return;

    window.location.href = `/searchpage.html?q=${encodeURIComponent(query)}`;
  }
});

function formatType(type) {
  switch (type) {
    case "movie": return "🎬 Movie";
    case "show": return "📺 TV Show";
    case "anime": return "🎌 Anime";
    case "book": return "📖 Book";
    default: return type;
  }
} 

renderTrending();


