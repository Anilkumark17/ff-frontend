import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicFinalOutput } from '../api/finalWork.api';
import CommentSection from '../components/project/CommentSection';
import './FinalWorkDetail.css';

const PublicFinalView = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOutputDetails();
  }, [id]);

  const loadOutputDetails = async () => {
    try {
      setLoading(true);
      const response = await getPublicFinalOutput(id);
      setOutput(response.data);
    } catch (err) {
      console.error('Error loading output details:', err);
      setError('Failed to load final output');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!output) return null;

    switch (output.type) {
      case 'image':
        return (
          <div className="preview-image">
            <img src={output.source_url} alt={output.title} />
          </div>
        );
      
      case 'video':
        return (
          <div className="preview-video">
            <video ref={videoRef} controls src={output.source_url}>
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="preview-pdf">
            <iframe src={output.source_url} title={output.title} />
          </div>
        );
      
      case 'link':
        return (
          <div className="preview-link">
            <a href={output.source_url} target="_blank" rel="noopener noreferrer">
              🔗 Open External Link
            </a>
          </div>
        );
      
      case 'text':
        return (
          <div className="preview-text">
            <iframe src={output.source_url} title={output.title} />
          </div>
        );
      
      default:
        return <div className="preview-unknown">Preview not available</div>;
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error || !output) {
    return (
      <div className="error-container">
        <p>{error || 'Output not found'}</p>
      </div>
    );
  }

  return (
    <div className="final-work-detail public-view">
      <div className="public-banner">
        <span>🌐 Public View</span>
      </div>

      <div className="detail-header">
        <div className="header-info">
          <h1>{output.title}</h1>
          <div className="meta-info">
            <span className="type-badge">{output.type}</span>
            <span className="date">
              {new Date(output.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {output.description && (
        <div className="description-section">
          <p>{output.description}</p>
        </div>
      )}

      <div className="preview-section">
        {renderPreview()}
      </div>

      <CommentSection 
        finalOutputId={id} 
        workType={output.type}
        videoRef={videoRef}
        isPublic={true}
      />
    </div>
  );
};

export default PublicFinalView;
