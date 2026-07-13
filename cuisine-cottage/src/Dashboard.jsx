import { useState } from 'react'
import { Link } from 'react-router-dom'
import CuisineChart from './CuisineChart'
import TimeChart from './TimeChart'

function Dashboard({ recipes, loading, shuffling, error, onShuffle }) {
  // Local state for the search bar and cuisine filter. These belong to this
  // page, not the whole app, so they live here.
  const [searchQuery, setSearchQuery] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('All')

  // Filter recipes by both the search bar and the cuisine dropdown.
  const filteredRecipes = recipes.filter((recipe) => {
    const titleMatch = recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const cuisineMatch =
      cuisineFilter === 'All' ||
      (recipe.cuisines && recipe.cuisines.includes(cuisineFilter))

    return titleMatch && cuisineMatch
  })

  // Build the list of cuisines for the dropdown from what's in the data.
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
  if (cuisineFilter !== 'All' && !cuisineOptions.includes(cuisineFilter)) {
    cuisineOptions.push(cuisineFilter)
  }

  // Summary statistics (from the filtered list, so they update live)
  const totalCount = filteredRecipes.length

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

  let averageReadyTime = 0
  if (filteredRecipes.length > 0) {
    let sum = 0
    filteredRecipes.forEach((recipe) => {
      sum += recipe.readyInMinutes
    })
    averageReadyTime = Math.round(sum / filteredRecipes.length)
  }

  // Handle the two "no content yet" states
  if (loading) {
    return (
      <div className="page-content">
        <div className="status">Gathering recipes from the pantry...</div>
      </div>
    )
  }

  if (error && recipes.length === 0) {
    return (
      <div className="page-content">
        <div className="status status-error">{error}</div>
      </div>
    )
  }

  // Main render
  return (
    <div className="page-content">
      <header className="page-header">
        <h1> Expanding Your Recipe Collection?</h1>
        <p className="page-subtitle">
          A collection of dishes from far and wide. Filter based on cuisine, search for a specific dish, or expand your palette by discovering new foods!
        </p>
      </header>

      {/* Summary statistics */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-label">Total recipes</div>
          <div className="stat-value">{totalCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Most common cuisine</div>
          <div className="stat-value">{mostCommonCuisine}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average ready time</div>
          <div className="stat-value">
            {averageReadyTime}
            <span className="stat-unit"> min</span>
          </div>
        </div>
      </section>

      {/* Data visualizations */}
      <section className="charts">
        <CuisineChart recipes={filteredRecipes} />
        <TimeChart recipes={filteredRecipes} />
      </section>

      {/* Search, filter, shuffle */}
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
          onClick={onShuffle}
          disabled={shuffling}
        >
          {shuffling ? 'gathering...' : 'Shuffle Recipes'}
        </button>
      </section>

      {error && recipes.length > 0 && (
        <div className="error-banner">{error}</div>
      )}

      {/* Recipe list — each row is a Link to the detail page */}
      <section className="recipe-list">
        <div className="recipe-row recipe-header-row">
          <div>Image</div>
          <div>Title</div>
          <div>Cuisine</div>
          <div>Ready time</div>
          <div>Servings</div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="empty">no recipes match your search or filter</div>
        ) : (
          filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="recipe-row recipe-row-link"
            >
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
            </Link>
          ))
        )}
      </section>
    </div>
  )
}

export default Dashboard
