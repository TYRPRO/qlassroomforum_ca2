import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom"
import CreateQn from './CreateQn.js';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li><Link to="Home">App</Link></li>
          <li><Link to="CreateQn">Create QN</Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/Home" element={<App />}></Route>
        <Route path="/CreateQn" element={<CreateQn />}></Route>
      </Routes>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
