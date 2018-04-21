import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../Containers/Dashboard';
import GameWrapper from '../../Containers/GameWrapper';

const App = () => (
  <main>
    <Route exact path="/" component={Dashboard} />
    <Route exact path="/:gameCode" component={GameWrapper} />
    <Route exact path="/host/:gameCode" component={GameWrapper} />
  </main>
);

export default App;
