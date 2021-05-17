import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import * as Views from "./views";
import {NavBarContainer} from "./containers/NavBar";
import {PageTop} from "./containers/PageTop";
import {ModalContainer} from "./containers/Modal";
import {useAuth} from "./hooks/auth";
import {Footer} from "@moosty/dao-storybook";
import {FooterAuthorDAO, FooterItemsDAO} from "@moosty/dao-storybook/dist/fixtures/dao/footerItemsDAO";

export const Routes = () => {
  const [currentOpen, setCurrentOpen] = useState();
  const [filtersFilter, setFilters] = useState();
  const {account, onLogin, onRegister, registerError, loadingSprinkler, onSignOut} = useAuth(setCurrentOpen);

  const updateFilters = (filter, value, filters) => {
    setFilters({
      ...filters,
      [filter]: value,
    })
  }

  return (
    <Router>
      <NavBarContainer
        setModal={setCurrentOpen}
        onSignOut={() => onSignOut()}
        user={account}
        onLoginClick={() => setCurrentOpen("login")}
        onRegisterClick={() => setCurrentOpen("register")}
      />
      <div className="w-full  min-h-screen  flex flex-col">
        <div className={"w-full mx-auto md:w-app 2xl:w-appWide flex-grow my-4"}>
        <PageTop updateFilters={updateFilters} filters={filtersFilter} />
        <Switch>
          <Route path={"/create-dao"}>
            <Views.CreateDao account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/create-dao-proposal"}>
            <Views.CreateVoting account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/daos"}>
            <Views.Daos account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/members"}>
            <Views.Members account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/votings/:args"}>
            <Views.Home filters={filtersFilter} account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/votings"}>
            <Views.Home filters={filtersFilter} account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/"}>
            <Views.LandingPage />
          </Route>
        </Switch>
        </div>
          <Footer
            author={FooterAuthorDAO}
            items={FooterItemsDAO}
          />
      </div>

      <ModalContainer
        currentOpen={currentOpen}
        setCurrentOpen={setCurrentOpen}
        onLogin={onLogin}
        onRegister={onRegister}
        externalError={registerError}
        ctaLoading={loadingSprinkler}
      />
    </Router>
  )
}
