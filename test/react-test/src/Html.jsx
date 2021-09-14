import React, { Component } from "react";

class Html extends React.Component {
  render() {
    return (
      <div>
        <canvas id="mainCanvas"></canvas>
        <div id="react"></div>
        <div id="boxes">
          <textarea>English</textarea>
          <textarea>French</textarea>
        </div>
        <main></main>
        <button id="listen">start</button>
      </div>
    );
  }
}

export default Html;