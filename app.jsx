import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'devpulse_items';

const INITIAL_ITEMS = [
  {
    id: '1',
    title: 'React 19 Migration',
    type: 'Project',
    status: 'In Progress',
    desc: 'Upgrading internal component libraries and testing concurrent features.',
    accent: '#38bdf8',
  },
  {
    id: '2',
    title: 'Global Dev Summit 2026',
    type: 'Event',
    status: 'Registered',
    desc: 'Virtual keynote on modern frontend architecture and web tooling.',
    accent: '#a855f7',
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 Audit',
    type: 'Project',
    status: 'Backlog',
    desc: 'Reviewing styling configuration and utility class breaking changes.',
    accent: '#f59e0b',
  },
];

const EMPTY_FORM = {
  title: '',
  type: 'Project',
  status: 'In Progress',
  desc: '',
  accent: '#38bdf8',
};

const FILTERS = ['All', 'Project', 'Event'];

function getStoredItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return INITIAL_ITEMS;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : INITIAL_ITEMS;
  } catch (error) {
    console.error('Failed to load saved items:', error);
    return INITIAL_ITEMS;
  }
}

export default function App() {
  const [items, setItems] = useState(getStoredItems);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Save items whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save items:', error);
    }
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        filter === 'All' || item.type === filter;

      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.desc.toLowerCase().includes(normalizedSearch) ||
        item.status.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [items, filter, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    const title = formData.title.trim();

    if (!title) return;

    const newItem = {
      ...formData,
      title,
      desc: formData.desc.trim(),
      id: crypto.randomUUID(),
    };

    setItems((prevItems) => [newItem, ...prevItems]);

    setFormData(EMPTY_FORM);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_FORM);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true"></div>
          <h1>DevPulse</h1>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New
        </button>
      </header>

      {/* Controls */}
      <section className="controls">
        <label className="search-wrapper">
          <span className="sr-only">Search items</span>

          <input
            type="search"
            className="search-input"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="tabs" role="tablist" aria-label="Filter items">
          {FILTERS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${
                filter === tab ? 'active' : ''
              }`}
              onClick={() => setFilter(tab)}
              role="tab"
              aria-selected={filter === tab}
            >
              {tab === 'All' ? 'All' : `${tab}s`}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <main className="card-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className="card"
              style={{
                '--card-accent': item.accent,
              }}
            >
              <div className="card-accent-strip"></div>

              <div className="card-content">
                <div className="card-header">
                  <span className="card-type">
                    {item.type}
                  </span>
                </div>

                <h3 className="card-title">
                  {item.title}
                </h3>

                <p className="card-desc">
                  {item.desc || 'No description provided.'}
                </p>
              </div>

              <div className="card-footer">
                <span className="status-badge">
                  {item.status}
                </span>

                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Delete ${item.title}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>No entries found</h3>
            <p>
              Try a different search term or filter.
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={handleOverlayClick}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <h2 id="modal-title">Add New Entry</h2>

              <button
                type="button"
                className="modal-close"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label htmlFor="title">Title</label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter a title"
                  value={formData.title}
                  onChange={handleInputChange}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Project">Project</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>

                <input
                  id="status"
                  name="status"
                  type="text"
                  placeholder="e.g. In Progress"
                  value={formData.status}
                  onChange={handleInputChange}
                />
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

              <div className="form-group">
                <label htmlFor="desc">Description</label>

                <textarea
                  id="desc"
                  name="desc"
                  rows="3"
                  placeholder="Add a short description..."
                  value={formData.desc}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
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