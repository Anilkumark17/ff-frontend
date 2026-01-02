import React, { useState, useEffect, useRef } from 'react';
import { getComments, addComment } from '../../api/finalWork.api';
import './CommentSection.css';

const CommentSection = ({ finalOutputId, workType, videoRef, isPublic = false }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [publicName, setPublicName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTimestamp, setPausedTimestamp] = useState(null);

  useEffect(() => {
    loadComments();
    
    // Set up video event listeners for pause/play
    if (workType === 'video' && videoRef?.current) {
      const video = videoRef.current;
      
      const handlePause = () => {
        setIsPaused(true);
        setPausedTimestamp(Math.floor(video.currentTime));
      };
      
      const handlePlay = () => {
        setIsPaused(false);
        setPausedTimestamp(null);
      };
      
      video.addEventListener('pause', handlePause);
      video.addEventListener('play', handlePlay);
      
      return () => {
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('play', handlePlay);
      };
    }
  }, [finalOutputId, workType, videoRef]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = isPublic 
        ? await import('../../api/finalWork.api').then(m => m.getPublicComments(finalOutputId))
        : await getComments(finalOutputId);
      setComments(response.data || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimestamp = () => {
    if (workType === 'video' && pausedTimestamp !== null) {
      return pausedTimestamp;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (isPublic && !publicName.trim()) {
      alert('Please enter your name');
      return;
    }

    setSubmitting(true);
    try {
      const timestamp_seconds = getCurrentTimestamp();
      
      if (isPublic) {
        const { addPublicComment } = await import('../../api/finalWork.api');
        await addPublicComment(finalOutputId, publicName, newComment, timestamp_seconds);
      } else {
        await addComment(finalOutputId, newComment, timestamp_seconds);
      }

      setNewComment('');
      // Resume video after submitting comment
      if (workType === 'video' && videoRef?.current) {
        videoRef.current.play();
      }
      await loadComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const jumpToTimestamp = (seconds) => {
    if (videoRef?.current && seconds !== null) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  const formatTimestamp = (seconds) => {
    if (seconds === null || seconds === undefined) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parsePublicComment = (comment) => {
    // Extract name from public comments format: "[Name]: comment"
    const match = comment.match(/^\[(.+?)\]:\s*(.+)$/);
    if (match) {
      return { name: match[1], text: match[2] };
    }
    return { name: 'Anonymous', text: comment };
  };

  // Determine if comment form should be shown
  const shouldShowCommentForm = () => {
    if (workType === 'video') {
      return isPaused; // Only show when paused for videos
    }
    return true; // Always show for non-video types
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>

      {/* Video pause instruction */}
      {workType === 'video' && !isPaused && (
        <div className="pause-instruction">
          ⏸️ <strong>Pause the video</strong> at any moment to add a timestamped comment
        </div>
      )}

      {/* Comment Form - Conditional for videos */}
      {shouldShowCommentForm() && (
        <form onSubmit={handleSubmit} className="comment-form">
          {isPublic && (
            <input
              type="text"
              placeholder="Your name"
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
              required
              className="name-input"
            />
          )}
          <div className="comment-input-wrapper">
            <textarea
              placeholder={
                workType === 'video' 
                  ? `Add a comment at ${formatTimestamp(pausedTimestamp)}` 
                  : "Add a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows="3"
              autoFocus={workType === 'video' && isPaused}
            />
            {workType === 'video' && pausedTimestamp !== null && (
              <div className="timestamp-indicator">
                🎬 {formatTimestamp(pausedTimestamp)}
              </div>
            )}
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => {
            const isPublicComment = comment.user_id === null;
            const parsedComment = isPublicComment ? parsePublicComment(comment.comment) : null;
            
            return (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    {isPublicComment ? (
                      <>
                        <span className="author-name">{parsedComment.name}</span>
                        <span className="guest-badge">Guest</span>
                      </>
                    ) : (
                      <span className="author-name">
                        {comment.user_profile?.full_name || 'User'}
                      </span>
                    )}
                  </div>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {comment.timestamp_seconds !== null && (
                  <button 
                    className="timestamp-btn"
                    onClick={() => jumpToTimestamp(comment.timestamp_seconds)}
                  >
                    🎬 {formatTimestamp(comment.timestamp_seconds)}
                  </button>
                )}
                
                <p className="comment-text">
                  {isPublicComment ? parsedComment.text : comment.comment}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
