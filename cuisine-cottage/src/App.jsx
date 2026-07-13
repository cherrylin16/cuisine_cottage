import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import RecipeDetail from './RecipeDetail'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

// How many recipes to fetch each time. Spoonacular's free tier gives 150
// points per day and random recipes cost about 1 point each, so 30 = 5
// shuffles per day.
const NUMBER_OF_RECIPES = 30

function App() {
  // Recipe state lives up here (not inside Dashboard) so that if we ever wanted
  // the Detail page to reuse this list too, it could. Right now the Detail page
  // does its own fetch by ID so that direct/deep links (like refreshing on
  // /recipe/12345) work even when the list hasn't loaded.
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)      // very-first-load
  const [shuffling, setShuffling] = useState(false) // shuffle button click
  const [error, setError] = useState(null)

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

  useEffect(() => {
    async function initialLoad() {
      await fetchRecipes()
      setLoading(false)
    }
    initialLoad()
  }, [])

  async function handleShuffle() {
    setShuffling(true)
    await fetchRecipes()
    setShuffling(false)
  }

  // Layout: sidebar on the left, page content on the right. The <Routes>
  // decides which page component fills the content area based on the URL.
  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                recipes={recipes}
                loading={loading}
                shuffling={shuffling}
                error={error}
                onShuffle={handleShuffle}
              />
            }
          />
          <Route
            path="/recipe/:id"
            element={<RecipeDetail apiKey={API_KEY} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
