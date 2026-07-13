import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Cottagecore-friendly palette for the pie slices — sage, rust, tan, wheat, etc.
const SLICE_COLORS = [
  '#7A8B6B', // sage
  '#B26449', // rust
  '#A98F5C', // wheat brown
  '#5C6E4E', // deep sage
  '#C08574', // rose clay
  '#8B7355', // aged brass
  '#D6A76A', // honey
  '#6B7A5E', // moss
]

function CuisineChart({ recipes }) {
  // Count how many recipes belong to each cuisine, then turn that into the
  // { name, value } shape that Recharts wants.

  const cuisineCounts = {}
  recipes.forEach((recipe) => {
    if (recipe.cuisines) {
      recipe.cuisines.forEach((c) => {
        cuisineCounts[c] = (cuisineCounts[c] || 0) + 1
      })
    }
  })

  const data = Object.entries(cuisineCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value) // biggest slice first

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Cuisines Represented</h3>
        <div className="chart-empty">
          none of the current recipes have a cuisine tag
        </div>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Cuisines Represented</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#FAF3E1',
              border: '1px solid #D6C7A8',
              borderRadius: '4px',
              fontFamily: 'Lora, Georgia, serif',
              color: '#3A2E24',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '13px',
              color: '#3A2E24',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CuisineChart
