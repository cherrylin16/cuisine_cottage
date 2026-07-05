import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

// per load means about 5 shuffles per day
const NUMBER_OF_RECIPES = 30

function App() {
  const [recipes, setRecipes] = useState([])           // list of recipes from the API
  const [loading, setLoading] = useState(true)         // true during the very first load
  const [shuffling, setShuffling] = useState(false)    // true when the shuffle button is fetching
  const [error, setError] = useState(null)             // holds an error message, if any
  const [searchQuery, setSearchQuery] = useState('')   // what the user types in the search bar
  const [cuisineFilter, setCuisineFilter] = useState('All') // selected cuisine dropdown value

  // Shared function that fetches a fresh batch of recipes from Spoonacular
  // Called once on first load, and again every time the shuffle button is clicked
  async function fetchRecipes() {
    try {
      setError(null)
      const url = `https://api.spoonacular.com/recipes/random?number=${NUMBER_OF_RECIPES}&apiKey=${API_KEY}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch recipes. Check your API key or daily quota.')
      }

      const data = await response.json()
      setRecipes(data.recipes)
    } catch (err) {
      setError(err.message)
    }
  }

  // useEffect runs once on first load, it calls fetchRecipes and then hides the loading screen
  useEffect(() => {
    async function initialLoad() {
      await fetchRecipes()
      setLoading(false)
    }
    initialLoad()
  }, [])

  // Called when the shuffle button is clicked to fetch fresh batch of recipes
  async function handleShuffle() {
    setShuffling(true)
    await fetchRecipes()
    setShuffling(false)
  }

  // Filter the recipes based on the search bar and cuisine dropdown
  // This runs every time the component re-renders (i.e. every keystroke)
  const filteredRecipes = recipes.filter((recipe) => {
    // Match the search to check if the recipe title contains the search text
    // case-insensitive
    const titleMatch = recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    // Match the cuisine: either "All" is selected, or the recipe's cuisines
    // list includes the selected cuisine.
    const cuisineMatch =
      cuisineFilter === 'All' ||
      (recipe.cuisines && recipe.cuisines.includes(cuisineFilter))

    return titleMatch && cuisineMatch
  })

  // Build the list of cuisines for the dropdown, based on what came back from the API
  // start with "All" as default and add each unique cuisine
  const cuisineOptions = ['All']
  recipes.forEach((recipe) => {
    if (recipe.cuisines) {
      recipe.cuisines.forEach((cuisine) => {
        if (!cuisineOptions.includes(cuisine)) {
          cuisineOptions.push(cuisine)
        }
      })
    }
  })
  // also include the currently-selected cuisine if it's not in the new list
  // (can happen right after a shuffle brings in different cuisines).
  if (cuisineFilter !== 'All' && !cuisineOptions.includes(cuisineFilter)) {
    cuisineOptions.push(cuisineFilter)
  }

  // Summary statistics (calculated from whatever is currently being displayed
  // after filtering, so the numbers update as the user searches/filters)

  // Stat #1: Total count of recipes shown
  const totalCount = filteredRecipes.length

  // Stat #2: Most common cuisine
  // Count how many times each cuisine appears, then pick the biggest one
  const cuisineCounts = {}
  filteredRecipes.forEach((recipe) => {
    if (recipe.cuisines) {
      recipe.cuisines.forEach((cuisine) => {
        cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1
      })
    }
  })

  let mostCommonCuisine = 'None'
  let highestCount = 0
  for (const cuisine in cuisineCounts) {
    if (cuisineCounts[cuisine] > highestCount) {
      highestCount = cuisineCounts[cuisine]
      mostCommonCuisine = cuisine
    }
  }

  // Stat #3: Average ready time in minutes
  let averageReadyTime = 0
  if (filteredRecipes.length > 0) {
    let sum = 0
    filteredRecipes.forEach((recipe) => {
      sum += recipe.readyInMinutes
    })
    averageReadyTime = Math.round(sum / filteredRecipes.length)
  }

  // Early returns for loading and error states
  if (loading) {
    return <div className="status">Gathering recipes from the pantry...</div>
  }

  if (error && recipes.length === 0) {
    return <div className="status status-error">{error}</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="title-row">
          <h1>Cuisine Cottage</h1>
        </div>
        <p className="subtitle">A collection of dishes from far and wide. Filter based on cuisine, search for a specific dish, or expand your palette by discovering new foods!</p>
      </header>

      {/* Summary statistics */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-label">total recipes</div>
          <div className="stat-value">{totalCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">most common cuisine</div>
          <div className="stat-value">{mostCommonCuisine}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">avg ready time</div>
          <div className="stat-value">
            {averageReadyTime}
            <span className="stat-unit"> min</span>
          </div>
        </div>
      </section>

      {/* Search, filter, and shuffle controls */}
      <section className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="cuisine-select"
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
        >
          {cuisineOptions.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        <button
          className="shuffle-button"
          onClick={handleShuffle}
          disabled={shuffling}
        >
          {shuffling ? 'Gathering...' : 'Shuffle Recipes'}
        </button>
      </section>

      {/* Show an error banner if a shuffle failed but we still have old recipes */}
      {error && recipes.length > 0 && (
        <div className="error-banner">{error}</div>
      )}

      {/* Recipe list */}
      <section className="recipe-list">
        <div className="recipe-row recipe-header-row">
          <div>image</div>
          <div>title</div>
          <div>cuisine</div>
          <div>ready time</div>
          <div>servings</div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="empty">no recipes match your search or filter</div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-row">
              <img
                className="recipe-image"
                src={recipe.image}
                alt={recipe.title}
              />
              <div className="recipe-title">{recipe.title}</div>
              <div className="recipe-cuisine">
                {recipe.cuisines && recipe.cuisines.length > 0
                  ? recipe.cuisines.join(', ')
                  : 'Not specified'}
              </div>
              <div className="recipe-meta">{recipe.readyInMinutes} min</div>
              <div className="recipe-meta">{recipe.servings}</div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export default App
