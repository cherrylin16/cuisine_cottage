import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function RecipeDetail({ apiKey }) {
  // useParams reads whatever piece of the URL matched ":id" in App.jsx.
  // So if the URL is /recipe/12345, id will be "12345".
  const { id } = useParams()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch the full recipe info by its ID whenever the URL changes.
  // Using the "get recipe information" endpoint gives us summary, ingredients,
  // and instructions — things we didn't show on the dashboard.
  
  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true)
        setError(null)
        const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Could not load this recipe. Check your API key or quota.')
        }

        const data = await response.json()
        setRecipe(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  // Loading and error states
  if (loading) {
    return (
      <div className="page-content">
        <div className="status">Fetching this recipe...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <Link to="/" className="back-link">← Dashboard</Link>
        <div className="status status-error">{error}</div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="page-content">
        <Link to="/" className="back-link">← Dashboard</Link>
        <div className="status">Recipe not found.</div>
      </div>
    )
  }

  // Pull out convenient pieces of the recipe data
  const ingredients = recipe.extendedIngredients || []
  const instructionSteps =
    recipe.analyzedInstructions && recipe.analyzedInstructions[0]
      ? recipe.analyzedInstructions[0].steps
      : []

  // Build a list of diet tags to show (vegan, vegetarian, gluten free, etc.)
  const dietTags = []
  if (recipe.vegan) dietTags.push('Vegan')
  if (recipe.vegetarian && !recipe.vegan) dietTags.push('Vegetarian')
  if (recipe.glutenFree) dietTags.push('Gluten Free')
  if (recipe.dairyFree) dietTags.push('Dairy Free')

  return (
    <div className="page-content detail-page">
      <Link to="/" className="back-link">← Dashboard</Link>

      {/* Header: image on the left, title/tags/meta on the right */}
      <header className="detail-header">
        <img
          className="detail-image"
          src={recipe.image}
          alt={recipe.title}
        />
        <div className="detail-header-info">
          <h1 className="detail-title">{recipe.title}</h1>

          {/* Cuisine + diet tags */}
          <div className="detail-tags">
            {recipe.cuisines && recipe.cuisines.map((c) => (
              <span key={c} className="tag tag-cuisine">{c}</span>
            ))}
            {dietTags.map((d) => (
              <span key={d} className="tag tag-diet">{d}</span>
            ))}
          </div>

          {/* Quick facts grid */}
          <div className="detail-meta">
            <div>
              <span className="detail-meta-label">ready in</span>
              <span className="detail-meta-value">{recipe.readyInMinutes} min</span>
            </div>
            <div>
              <span className="detail-meta-label">servings</span>
              <span className="detail-meta-value">{recipe.servings}</span>
            </div>
            <div>
              <span className="detail-meta-label">health score</span>
              <span className="detail-meta-value">{recipe.healthScore}</span>
            </div>
            <div>
              <span className="detail-meta-label">$ per serving</span>
              <span className="detail-meta-value">
                ${(recipe.pricePerServing / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Summary — Spoonacular returns HTML here so we render it directly.
          dangerouslySetInnerHTML is fine because it's coming from a trusted API. */}
      {recipe.summary && (
        <section className="detail-section">
          <h2 className="detail-section-title">About</h2>
          <div
            className="detail-summary"
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          />
        </section>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-section-title">Ingredients</h2>
          <ul className="ingredients-list">
            {ingredients.map((ing) => (
              <li key={ing.id + '-' + ing.original}>{ing.original}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Instructions */}
      {instructionSteps.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-section-title">Instructions</h2>
          <ol className="instructions-list">
            {instructionSteps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Link to the original source */}
      {recipe.sourceUrl && (
        <section className="detail-section detail-source">
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
            View original recipe at {recipe.sourceName || 'source'} →
          </a>
        </section>
      )}
    </div>
  )
}

export default RecipeDetail
