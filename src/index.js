import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom"
import CreateQn from './CreateQn.js';
import ViewQn from './ViewQn.js'
import MyActivity from './Components/MyActivityComponents/MyActivity';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li><Link to="Home">App</Link></li>
            <li><Link to="CreateQn">Create QN</Link></li>
            <li><Link to="posts/c059519c-6793-4ef8-9026-14869d61f28a">Post</Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/Home" element={<App />}></Route>
        <Route path="/CreateQn" element={<CreateQn />}></Route>
        <Route path="/posts/:post_id" element={<ViewQn />}></Route>
        <Route path="/myactivity" element={<MyActivity />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
