// components/LoadingScreen.js

import React from "react";
import "./loadingscreen.css"; // Import the CSS styles

const LoadingScreen = () => {
  return (
    <div className="loading_section flex-col items-center justify-center">
      <div className="flipping">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
