import { useState, useEffect } from 'react';

const INITIAL_ITEMS = [
  {
    id: '1',
    title: 'React 19 Migration',
    type: 'Project',
    status: 'In Progress',
    desc: 'Upgrading internal component libraries and testing concurrent features.',
    accent: '#38bdf8'
  },
  {
    id: '2',
    title: 'Global Dev Summit 2026',
    type: 'Event',
    status: 'Registered',
    desc: 'Virtual keynote on modern frontend architecture and web tooling.',
    accent: '#a855f7'
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 Audit',
    type: 'Project',
    status: 'Backlog',
    desc: 'Reviewing styling configuration and utility class breaking changes.',
    accent: '#f59e0b'
  }
];

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('devpulse_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Item Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Project',
    status: 'In Progress',
    desc: '',
    accent: '#38bdf8'
  });

  useEffect(() => {
    localStorage.setItem('devpulse_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newItem = {
      ...formData,
      id: Date.now().toString()
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      type: 'Project',
      status: 'In Progress',
      desc: '',
      accent: '#38bdf8'
    });
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon"></div>
          <h1>DevPulse</h1>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add New
        </button>
      </header>

      {/* Controls */}
      <div className="controls">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search items..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tabs">
          {['All', 'Project', 'Event'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}s
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="card-grid">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="card"
            style={{ '--card-accent': item.accent }}
          >
            <div className="card-accent-strip"></div>
            <div>
              <div className="card-header">
                <span className="card-type">{item.type}</span>
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
            </div>

            <div className="card-footer">
              <span className="status-badge">{item.status}</span>
              <button 
                className="btn-delete" 
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Entry</h2>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Project">Project</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <input 
                  type="text" 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Accent Color</label>
                <input 
                  type="color" 
                  value={formData.accent} 
                  onChange={e => setFormData({...formData, accent: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={formData.desc} 
                  onChange={e => setFormData({...formData, desc: e.target.value})} 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
