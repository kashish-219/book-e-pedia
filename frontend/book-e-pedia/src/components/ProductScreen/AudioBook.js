import React, { useState, useRef, useEffect } from "react";
import "./AudioBook.css";
import p1 from './p1.jpeg';
import audioFile from './jonasonfarminwinter_01_abbott_64kb.mp3'; // Adjust the path accordingly

const AudioBook = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="audiobook-container">
      <div className="cover">
        <img src={p1} alt="Audiobook Cover" />
      </div>
      <h2>Careful What You Wish For</h2>
      <p>By Shari Lapena</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
      </div>
      <div className="controls">
        <button onClick={() => skipTime(-10)}><i className="fas fa-fast-backward"></i></button>
        <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
        <button onClick={() => skipTime(10)}><i className="fas fa-fast-forward"></i></button>
      </div>
      <div className="time-controls">
        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
      </div>
      <audio ref={audioRef} src={audioFile}></audio>
    </div>
  );
};

export default AudioBook;