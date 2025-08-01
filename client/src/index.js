/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './state/store';
import authOperations from './state/redux/auth/operations';
import Theme from './components/Theme';
import App from './components/App';
import { unregister } from './registerServiceWorker';
import './index.css'; // Import modern Tailwind styles


const mode = localStorage.getItem('theme-mode') || 'light';
const store = createStore({ theme: { mode } });

store.subscribe(themeSideEffect(store));

function themeSideEffect(storeObj) {
	let theme;
	return () => {
		const state = storeObj.getState();
		if (theme !== state.theme) {
			theme = state.theme;
			localStorage.setItem('theme-mode', theme.mode);
			
			// Apply theme class to document
			document.documentElement.classList.toggle('dark', theme.mode === 'dark');
		}
	};
}

// Initialize theme class
document.documentElement.classList.toggle('dark', mode === 'dark');

store.dispatch(authOperations.network());

unregister();

ReactDOM.render(
	<Provider store={store}>
		<Theme>
			<App />
		</Theme>
	</Provider>,
	document.getElementById('root')
);
