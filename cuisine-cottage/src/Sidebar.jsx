import { NavLink } from 'react-router-dom'

// Small hand-drawn wheat sprig used as the sidebar mark.
function WheatSprig() {
  return (
    <svg
      className="sidebar-mark"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20 4v34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M20 12c-4-1-7-3-7-6 4 0 7 2 7 6zM20 12c4-1 7-3 7-6-4 0-7 2-7 6z"
        fill="currentColor"
      />
      <path
        d="M20 20c-4-1-7-3-7-6 4 0 7 2 7 6zM20 20c4-1 7-3 7-6-4 0-7 2-7 6z"
        fill="currentColor"
      />
      <path
        d="M20 28c-4-1-7-3-7-6 4 0 7 2 7 6zM20 28c4-1 7-3 7-6-4 0-7 2-7 6z"
        fill="currentColor"
      />
    </svg>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <WheatSprig />
        <div className="sidebar-title">Cuisine Cottage</div>
      </div>

      {/* NavLink adds the "active" class automatically when the URL matches */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
          }
          end
        >
          Dashboard
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-quote">
          "Good food, good eating, is all about risk."
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
