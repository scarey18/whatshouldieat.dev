import React from 'react';
import ReactDOM from 'react-dom';
import 'sanitize.css';
import 'index.scss';
import { BrowserRouter } from 'react-router-dom';
import App from 'components/App';
import * as serviceWorker from 'serviceWorker';


ReactDOM.render((
	<BrowserRouter>
		<App />
	</BrowserRouter>
), document.getElementById('root'));

serviceWorker.register();