import React, { useState, useEffect } from 'react';
import { getFinalOutputs } from '../../api/finalWork.api';
import './FinalWorkList.css';

const FinalWorkList = ({ projectId, onSelectWork, refreshTrigger }) => {
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFinalOutputs();
  }, [projectId, refreshTrigger]);

  const loadFinalOutputs = async () => {
    try {
      setLoading(true);
      const response = await getFinalOutputs(projectId);
      setOutputs(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading final outputs:', err);
      setError('Failed to load final outputs');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = (outputId) => {
    const shareUrl = `${window.location.origin}/public/final/${outputId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const getThumbnail = (output) => {
    if (output.type === 'image') {
      return output.source_url;
    } else if (output.type === 'video') {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23a855f7" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" font-family="Arial" text-anchor="middle" dy=".3em"%3EVideo%3C/text%3E%3C/svg%3E';
    } else if (output.type === 'pdf') {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ef4444" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" font-family="Arial" text-anchor="middle" dy=".3em"%3EPDF%3C/text%3E%3C/svg%3E';
    } else if (output.type === 'link') {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%233b82f6" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" font-family="Arial" text-anchor="middle" dy=".3em"%3ELink%3C/text%3E%3C/svg%3E';
    } else {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2310b981" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" font-family="Arial" text-anchor="middle" dy=".3em"%3EText%3C/text%3E%3C/svg%3E';
    }
  };

  if (loading) {
    return <div className="loading">Loading final outputs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (outputs.length === 0) {
    return (
      <div className="empty-state">
        <p>No final outputs uploaded yet.</p>
        <p>Upload your first final work above!</p>
      </div>
    );
  }

  return (
    <div className="final-work-list">
      <h2>Final Outputs ({outputs.length})</h2>
      <div className="outputs-grid">
        {outputs.map((output) => (
          <div key={output.id} className="output-card">
            <div 
              className="output-thumbnail"
              onClick={() => onSelectWork && onSelectWork(output.id)}
            >
              <img src={getThumbnail(output)} alt={output.title} />
              <div className="type-badge">{output.type}</div>
            </div>
            <div className="output-content">
              <h3 className="output-title">{output.title}</h3>
              {output.description && (
                <p className="output-description">{output.description}</p>
              )}
              <div className="output-meta">
                <span className="output-date">
                  {new Date(output.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="output-actions">
                <button 
                  className="view-btn"
                  onClick={() => onSelectWork && onSelectWork(output.id)}
                >
                  View Details
                </button>
                <button 
                  className="share-btn"
                  onClick={() => copyShareLink(output.id)}
                >
                  📋 Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalWorkList;
