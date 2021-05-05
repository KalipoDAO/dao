import React from 'react';
import ReactDOM from 'react-dom';
import {api, AppContext} from './appContext';
import {Routes} from "./routes";

ReactDOM.render(
  <AppContext.Provider value={api}>
    <Routes/>
  </AppContext.Provider>,
  document.getElementById('root')
);
