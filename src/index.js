import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import Subforum from './Components/Subforum';
import CreateSubforum from './Components/CreateSubforum';
import { createStore, applyMiddleware, compose } from "redux";
import allReducers from "./store/reducers/index";
import { Provider } from "react-redux";
import thunk from 'redux-thunk';
import reportWebVitals from './reportWebVitals';
import {
	BrowserRouter,
	Routes,
	Route,
	Link
} from "react-router-dom"
import CreateQn from './CreateQn.js';
import ViewQn from './ViewQn.js'

const composedEnhancer = compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk))

const store = createStore(allReducers, composedEnhancer);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
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
					<Route path="subforum/:subForum" element={<Subforum />} />
					<Route path="newforum" element={<CreateSubforum />} />
				</Routes>
			</BrowserRouter>
		</Provider>


	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
