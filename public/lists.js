const storedLists = JSON.parse(localStorage.getItem("kanonifyLists")) || {
    watching: [],
    reading: [],
    completed: []
  };

  const watchingEl = document.getElementById("watchingList");
  const readingEl = document.getElementById("readingList");
  const completedEl = document.getElementById("completedList");
  
  renderList(storedLists.watching, watchingEl);
  renderList(storedLists.reading, readingEl);
  renderList(storedLists.completed, completedEl);
  
  function renderList(list, container) {
    container.innerHTML = "";
  
    if (!list.length) {
      container.innerHTML = `<p class="empty-list">No items yet.</p>`;
      return;
    }
  
    list.forEach(item => {
      const div = document.createElement("div");
      div.className = "list-item";
  
      div.innerHTML = `
        <strong>${item.title}</strong>
        <span class="list-type">${formatType(item.type)}</span>
        <button class="remove-btn">✖ Remove</button>
      `;

      const removeBtn = div.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => {
        removeFromList(item.id, container.id);
    });

      container.appendChild(div);
    });
  }

  function removeFromList(itemId, containerId) {
    const stored = JSON.parse(localStorage.getItem("kanonifyLists")) || {
      watching: [],
      reading: [],
      completed: []
    };
  
    let listKey = "";
  
    if (containerId === "watchingList") listKey = "watching";
    if (containerId === "readingList") listKey = "reading";
    if (containerId === "completedList") listKey = "completed";
  
    stored[listKey] = stored[listKey].filter(item => item.id !== itemId);
  
    localStorage.setItem("kanonifyLists", JSON.stringify(stored));
  
    renderList(stored.watching, watchingEl);
    renderList(stored.reading, readingEl);
    renderList(stored.completed, completedEl);
  }
  
  function formatType(type) {
    switch (type) {
      case "movie": return "🎬 Movie";
      case "show": return "📺 TV Show";
      case "anime": return "🎌 Anime";
      case "book": return "📖 Book";
      default: return type;
    }
  }
  