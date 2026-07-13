import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function TimeChart({ recipes }) {
  // Group recipes into time buckets so we can see how quick vs slow the
  // collection tends to skew.
  const buckets = [
    { name: '≤15 min', count: 0 },
    { name: '16-30', count: 0 },
    { name: '31-45', count: 0 },
    { name: '46-60', count: 0 },
    { name: '60+', count: 0 },
  ]

  recipes.forEach((recipe) => {
    const t = recipe.readyInMinutes
    if (t <= 15) buckets[0].count++
    else if (t <= 30) buckets[1].count++
    else if (t <= 45) buckets[2].count++
    else if (t <= 60) buckets[3].count++
    else buckets[4].count++
  })

  return (
    <div className="chart-card">
      <h3 className="chart-title">How Long These Recipes Take</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={buckets} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#D6C7A8" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#6B5D4E"
            tick={{ fontFamily: 'Lora, Georgia, serif', fontSize: 13 }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#6B5D4E"
            tick={{ fontFamily: 'Lora, Georgia, serif', fontSize: 13 }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(122, 139, 107, 0.08)' }}
            contentStyle={{
              backgroundColor: '#FAF3E1',
              border: '1px solid #D6C7A8',
              borderRadius: '4px',
              fontFamily: 'Lora, Georgia, serif',
              color: '#3A2E24',
            }}
          />
          <Bar dataKey="count" fill="#7A8B6B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TimeChart
