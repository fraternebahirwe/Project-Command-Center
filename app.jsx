import { useEffect, useState } from 'react';

const STORAGE_KEY = 'devpulse_items';

const INITIAL_ITEMS = [
  {
    id: '1',
    title: 'React 19 Migration',
    status: 'In Progress',
    accent: '#38bdf8',
  },
  {
    id: '2',
    title: 'Global Dev Summit 2026',
    status: 'Completed',
    accent: '#a855f7',
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 Audit',
    status: 'On Hold',
    accent: '#f59e0b',
  },
];

const EMPTY_FORM = {
  title: '',
  status: 'In Progress',
  accent: '#6366f1',
};

function getStoredItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_ITEMS;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : INITIAL_ITEMS;
  } catch (error) {
    console.error('Failed to load saved items:', error);
    return INITIAL_ITEMS;
  }
}

export default function App() {
  const [items, setItems] = useState(getStoredItems);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save items:', error);
    }
  }, [items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const title = formData.title.trim();
    if (!title) return;

    const newItem = {
      ...formData,
      title,
      id: crypto.randomUUID(),
    };

    setItems((prevItems) => [newItem, ...prevItems]);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress': return 'status-in-progress';
      case 'On Hold': return 'status-on-hold';
      case 'Completed': return 'status-completed';
      default: return 'status-in-progress';
    }
  };

  return (
    <div className="app-container">
      {/* Header matching design UI */}
      <header className="header">
        <h1>Project Command Center</h1>
        <p>Manage project lifecycles from initial setup to deployment</p>
      </header>

      {/* Main 2-column layout */}
      <div className="main-content">
        
        {/* Sidebar Form */}
        <aside className="card form-card">
          <h2>Add New Project</h2>
          <form onSubmit={handleAddItem} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Portfolio Redesign"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="accent">Accent Color</label>
              <input
                id="accent"
                name="accent"
                type="color"
                value={formData.accent}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              Add Project
            </button>
          </form>
        </aside>

        {/* Project List Display Section */}
        <main className="card list-card">
          <h2>Active Projects ({items.length})</h2>
          
          <div className="projects-list" style={{ marginTop: '1rem' }}>
            {items.length > 0 ? (
              items.map((item) => (
                <article key={item.id} className="project-item">
                  <div className="project-header">
                    <div 
                      className="project-color-indicator" 
                      style={{ backgroundColor: item.accent }}
                    />
                    <h3>{item.title}</h3>
                    
                    <select 
                      className={`status-badge ${getStatusClass(item.status)}`}
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="progress-container">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        backgroundColor: item.accent,
                        width: item.status === 'Completed' ? '100%' : item.status === 'On Hold' ? '35%' : '65%'
                      }}
                    />
                  </div>

                  <div className="card-controls">
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.title}`}
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <p>No projects added yet.</p>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
