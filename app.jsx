import { useEffect, useState } from 'react';

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
    status: 'Completed',
    desc: 'Virtual keynote on modern frontend architecture and web tooling.',
    accent: '#a855f7',
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 Audit',
    type: 'Project',
    status: 'On Hold',
    desc: 'Reviewing styling configuration and utility class breaking changes.',
    accent: '#f59e0b',
  },
];

const EMPTY_FORM = {
  title: '',
  type: 'Project',
  status: 'In Progress',
  desc: '',
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

  // Sauvegarde automatique dans le LocalStorage
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
      desc: formData.desc.trim(),
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
      {/* Header unifié avec votre style.css */}
      <header className="header">
        <h1>DevPulse</h1>
        <p>Suivi de vos projets et objectifs en temps réel</p>
      </header>

      {/* Layout principal en 2 colonnes */}
      <div className="main-content">
        
        {/* Formulaire latéral fixe (Sidebar) */}
        <aside className="card form-card">
          <h2>Nouvelle Entrée</h2>
          <form onSubmit={handleAddItem} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Ex: Refonte Dashboard"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleInputChange}>
                <option value="Project">Projet</option>
                <option value="Event">Événement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Statut initial</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="desc">Description</label>
              <input
                id="desc"
                name="desc"
                type="text"
                placeholder="Brève description..."
                value={formData.desc}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="accent">Couleur thématique</label>
              <input
                id="accent"
                name="accent"
                type="color"
                value={formData.accent}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              Ajouter l'élément
            </button>
          </form>
        </aside>

        {/* Section de rendu des cartes */}
        <main className="card list-card">
          <h2>Liste des flux récents</h2>
          
          <div className="projects-list" style={{ marginTop: '1rem' }}>
            {items.length > 0 ? (
              items.map((item) => (
                <article key={item.id} className="project-item">
                  <div className="project-header">
                    {/* Indicateur de couleur dynamique */}
                    <div 
                      className="project-color-indicator" 
                      style={{ backgroundColor: item.accent }}
                    />
                    <h3>{item.title}</h3>
                    
                    {/* Badge de statut interactif synchro avec le CSS */}
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

                  {/* Barre de progression fictive mais esthétique incluse dans votre CSS */}
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
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.desc || 'Aucune description spécifiée.'}
                    </label>
                    
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Supprimer ${item.title}`}
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <p>Aucun projet ou événement en cours. Utilisez le formulaire pour commencer.</p>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
