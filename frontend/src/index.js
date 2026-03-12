
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App.jsx";
import reportWebVitals from './reportWebVitals';
import "rsuite/dist/rsuite.min.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


const observer = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends observer {
  constructor(callback) {
    super((entries, observer) => {
      requestAnimationFrame(() => {
        callback(entries, observer);
      });
    });
  }
};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


