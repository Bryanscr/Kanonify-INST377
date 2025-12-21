async function loadReviewChart() {
    try {
      const res = await fetch("/reviews");
      const reviews = await res.json();

      if (!reviews || reviews.length === 0) {
        console.warn("No reviews available for chart.");
        return;
      }

      const counts = {
        movie: 0,
        show: 0,
        anime: 0,
        book: 0
      };
  
      reviews.forEach(review => {
        if (counts.hasOwnProperty(review.media_type)) {
          counts[review.media_type]++;
        }
      });
  
      const data = {
        labels: ["Movies", "TV Shows", "Anime", "Books"],
        datasets: [
          {
            label: "Number of Reviews",
            data: [
              counts.movie,
              counts.show,
              counts.anime,
              counts.book
            ],
            backgroundColor: [
              "#e50914", 
              "#1db954", 
              "#f5c518", 
              "#4285f4"  
            ],
            borderRadius: 6
          }
        ]
      };
  
      const config = {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      };
  
      const ctx = document.getElementById("reviewsChart").getContext("2d");
      new Chart(ctx, config);
  
    } catch (err) {
      console.error("Failed to load review chart:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", loadReviewChart);
  