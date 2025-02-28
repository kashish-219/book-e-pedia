import React from 'react';
import './VideoBook.css'; // Make sure to create this CSS file
import vb1 from './chapter1.mp4'

const VideoBook = () => {
  return (
    <div className="video-book-container">
      <header className="video-book-header">
        <h1>Welcome to the Video Book</h1>
        <p className="video-book-chapter-title">Chapter 1: A Journey Begins</p>
      </header>

      <section className="video-book-video-container">
        <video controls>
          <source src={vb1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <footer className="video-book-footer">
        <p>© 2025 Video Book Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VideoBook;