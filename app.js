(function() {
  // --- Private Data ---
  const recipes = [
    {
      id: 1,
      title: "🍝 Classic Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
      category: "pasta",
      ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
      steps: [
        "Boil pasta",
        "Cook pancetta",
        "Mix eggs and cheese",
        "Combine all",
        { step: "Make sauce", substeps: ["Heat pan", "Add ingredients", "Simmer"] }
      ]
    },
    {
      id: 2,
      title: "🍛 Chicken Tikka Masala",
      time: 45,
      difficulty: "medium",
      description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
      category: "curry",
      ingredients: ["Chicken", "Yogurt", "Spices", "Tomatoes", "Cream"],
      steps: [
        "Marinate chicken",
        "Grill chicken",
        { step: "Prepare sauce", substeps: ["Heat oil", "Add spices", "Add tomatoes", "Simmer"] },
        "Combine chicken and sauce"
      ]
    },
    {
      id: 3,
      title: "🥗 Greek Salad",
      time: 15,
      difficulty: "easy",
      description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
      category: "salad",
      ingredients: ["Cucumber", "Tomatoes", "Feta", "Olives", "Olive Oil"],
      steps: ["Chop vegetables", "Mix with feta and olives", "Dress with olive oil"]
    }
    // ... add more recipes with ingredients and steps
  ];

  const recipeContainer = document.querySelector('#recipe-container');
  let currentRecipes = [...recipes];

  // --- Private Functions ---
  const renderList = (items) => {
    let html = "<ul>";
    items.forEach(item => {
      if (typeof item === "string") {
        html += `<li>${item}</li>`;
      } else if (typeof item === "object" && item.substeps) {
        html += `<li>${item.step}${renderList(item.substeps)}</li>`;
      }
    });
    html += "</ul>";
    return html;
  };

  const createRecipeCard = (recipe) => {
    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${recipe.time} min</span>
          <span class="difficulty ${recipe.difficulty.trim()}">${recipe.difficulty.trim()}</span>
        </div>
        <p>${recipe.description}</p>
        <button class="toggle-btn" data-target="steps-${recipe.id}">Show Steps</button>
        <div id="steps-${recipe.id}" class="steps hidden">
          ${renderList(recipe.steps)}
        </div>
        <button class="toggle-btn" data-target="ingredients-${recipe.id}">Show Ingredients</button>
        <div id="ingredients-${recipe.id}" class="ingredients hidden">
          ${renderList(recipe.ingredients)}
        </div>
      </div>
    `;
  };

  const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join('');
    attachToggleEvents();
  };

  const attachToggleEvents = () => {
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        targetEl.classList.toggle("hidden");
        btn.textContent = targetEl.classList.contains("hidden")
          ? btn.textContent.replace("Hide", "Show")
          : btn.textContent.replace("Show", "Hide");
      });
    });
  };

  // Filtering logic
  const filterRecipes = (filter) => {
    switch(filter) {
      case "easy":
      case "medium":
      case "hard":
        currentRecipes = recipes.filter(r => r.difficulty.trim() === filter);
        break;
      case "quick":
        currentRecipes = recipes.filter(r => r.time < 30);
        break;
      default: // "all"
        currentRecipes = [...recipes];
    }
    renderRecipes(currentRecipes);
  };

  // Sorting logic
  const sortRecipes = (sortType) => {
    if (sortType === "name") {
      currentRecipes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "time") {
      currentRecipes.sort((a, b) => a.time - b.time);
    }
    renderRecipes(currentRecipes);
  };

  // Active state handler
  const setActiveButton = (group, button) => {
    document.querySelectorAll(`#controls .${group} button`)
      .forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  };

  // Event listeners for filters
  document.querySelectorAll("#controls .filters button").forEach(button => {
    button.addEventListener("click", () => {
      filterRecipes(button.dataset.filter);
      setActiveButton("filters", button);
    });
  });

  // Event listeners for sorts
  document.querySelectorAll("#controls .sorts button").forEach(button => {
    button.addEventListener("click", () => {
      sortRecipes(button.dataset.sort);
      setActiveButton("sorts", button);
    });
  });

  // --- Public API ---
  const App = {
    init: () => {
      renderRecipes(recipes);
    }
  };

  // Initialize
  App.init();

})();