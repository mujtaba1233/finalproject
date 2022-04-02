import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from './store';
import { Provider } from 'react-redux';
try {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
          <App />
      </Router>
    </Provider>,
    document.getElementById('root')
  );
} catch (e) {
  document.write('something went wrong');
}