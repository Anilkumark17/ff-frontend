import React, { useState } from 'react';
import { uploadFinalWork } from '../../api/finalWork.api';
import './FinalUpload.css';

const FinalUpload = ({ projectId, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    work_type: 'image',
    file: null,
    url: '',
    textContent: '',
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      const data = new FormData();
      data.append('filename', formData.name);
      data.append('project_id', projectId);
      data.append('description', formData.description);

      // Handle different work types
      if (formData.work_type === 'link') {
        // For links, we'll upload a text file with the URL
        const blob = new Blob([formData.url], { type: 'text/plain' });
        data.append('file', blob, 'link.txt');
      } else if (formData.work_type === 'text') {
        // For text content, upload as text file
        const blob = new Blob([formData.textContent], { type: 'text/plain' });
        data.append('file', blob, 'content.txt');
      } else {
        // For file uploads (image, video, pdf)
        if (!formData.file) {
          setError('Please select a file to upload');
          setUploading(false);
          return;
        }
        data.append('file', formData.file);
      }

      await uploadFinalWork(projectId, data);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        work_type: 'image',
        file: null,
        url: '',
        textContent: '',
      });

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      alert('Final work uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload final work');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="final-upload-container">
      <h2>Upload Final Work</h2>
      <form onSubmit={handleSubmit} className="final-upload-form">
        <div className="form-group">
          <label htmlFor="name">Work Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter work name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the work"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="work_type">Work Type *</label>
          <select
            id="work_type"
            name="work_type"
            value={formData.work_type}
            onChange={handleInputChange}
            required
          >
            <option value="image">Image</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="link">External Link</option>
            <option value="text">Text Content</option>
          </select>
        </div>

        {/* File upload for image, pdf, video */}
        {['image', 'pdf', 'video'].includes(formData.work_type) && (
          <div className="form-group">
            <label htmlFor="file">Upload File *</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept={
                formData.work_type === 'image' ? 'image/*' :
                formData.work_type === 'pdf' ? 'application/pdf' :
                formData.work_type === 'video' ? 'video/*' : '*'
              }
              required
            />
          </div>
        )}

        {/* URL input for links */}
        {formData.work_type === 'link' && (
          <div className="form-group">
            <label htmlFor="url">URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              required
              placeholder="https://example.com"
            />
          </div>
        )}

        {/* Text editor for text content */}
        {formData.work_type === 'text' && (
          <div className="form-group">
            <label htmlFor="textContent">Text Content *</label>
            <textarea
              id="textContent"
              name="textContent"
              value={formData.textContent}
              onChange={handleInputChange}
              required
              placeholder="Enter your text content here"
              rows="8"
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={uploading} className="submit-btn">
          {uploading ? 'Uploading...' : 'Upload Final Work'}
        </button>
      </form>
    </div>
  );
};

export default FinalUpload;
