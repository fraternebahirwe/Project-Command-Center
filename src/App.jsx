import React, { useState, useEffect } from 'react';

function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('devpulse_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [accent, setAccent] = useState('#6366f1');

  useEffect(() => {
    localStorage.setItem('devpulse_projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject = {
      id: Date.now(),
      title,
      status,
      progress: 0, // Starts at 0% by default
      accent,
    };

    setProjects([newProject, ...projects]);
    setTitle('');
    setStatus('In Progress');
  };

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Auto-update status when adjusting progress slider on the card
  const handleProgressChange = (id, newProgress) => {
    const progressNum = Number(newProgress);

    setProjects(
      projects.map((p) => {
        if (p.id !== id) return p;

        let updatedStatus = p.status;
        if (progressNum === 100) {
          updatedStatus = 'Completed';
        } else if (progressNum < 100 && p.status === 'Completed') {
          updatedStatus = 'In Progress';
        }

        return {
          ...p,
          progress: progressNum,
          status: updatedStatus,
        };
      })
    );
  };

  // Manual status toggle (In Progress <-> On Hold)
  const handleStatusChange = (id, newStatus) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Project Command Center</h1>
        <p>Manage project lifecycles from initial setup to deployment</p>
      </header>

      <div className="main-content">
        {/* Form Panel (Clean & Streamlined) */}
        <div className="card form-card">
          <h2>Add New Project</h2>
          <form onSubmit={handleAddProject}>
            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                placeholder="e.g. Portfolio Redesign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label>Accent Color</label>
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">
              Add Project
            </button>
          </form>
        </div>

        {/* Projects List Panel */}
        <div className="card list-card">
          <h2>Active Projects ({projects.length})</h2>
          
          <div className="projects-list">
            {projects.length === 0 ? (
              <p className="empty-state">No projects added yet.</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="project-item"
                  style={{ borderLeft: `5px solid ${project.accent}` }}
                >
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    
                    {/* Status Badge vs Selection Dropdown */}
                    {project.progress === 100 ? (
                      <span className="status-badge status-completed">COMPLETED</span>
                    ) : (
                      <select
                        className={`status-badge status-${project.status.toLowerCase().replace(' ', '-')}`}
                        value={project.status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    )}

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(project.id)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dynamic Visual Progress Bar */}
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.accent,
                      }}
                    ></div>
                  </div>

                  {/* Card Controls */}
                  <div className="card-controls">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={project.progress === 100}
                        onChange={(e) => handleProgressChange(project.id, e.target.checked ? 100 : 0)}
                      />
                      <span>{project.progress === 100 ? 'Done 🎉' : 'Mark Complete'}</span>
                    </label>

                    {/* Interactive Slider with Percentage Readout */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{project.progress}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={project.progress}
                        onChange={(e) => handleProgressChange(project.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
