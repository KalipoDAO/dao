import React from "react";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import * as Views from "./views";
import {NavBarContainer} from "./containers/NavBar";
import {PageTop} from "./containers/PageTop";

export const Routes = () => {
  return (
    <Router>
      <NavBarContainer/>
      <div className="w-full md:w-app mx-auto">
        <PageTop/>
        <Switch>
          <Route path={"/daos"}>
            <Views.Home/>
          </Route>
          <Route path={"/members"}>
            <Views.Home/>
          </Route>
          <Route path={"/votings/:args"}>
            <Views.Home/>
          </Route>
          <Route path={"/votings"}>
            <Views.Home/>
          </Route>
          <Route path={"/"}>
            <Views.Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
