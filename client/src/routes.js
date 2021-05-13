import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import * as Views from "./views";
import {NavBarContainer} from "./containers/NavBar";
import {PageTop} from "./containers/PageTop";
import {ModalContainer} from "./containers/Modal";
import {useAuth} from "./hooks/auth";
import {Footer} from "@moosty/dao-storybook";
import {FooterAuthorDAO, FooterItemsDAO} from "@moosty/dao-storybook/dist/fixtures/footerItemsDAO";

export const Routes = () => {
  const [currentOpen, setCurrentOpen] = useState();
  const [filters, setFilters] = useState();
  const {account, onLogin, onRegister, registerError, loadingSprinkler, onSignOut} = useAuth(setCurrentOpen);

  useEffect(() => {
    console.log(account)
  }, [account])

  const updateFilters = (filter, value) => {
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
        <div className={"w-full mx-auto md:w-app flex-grow mb-10"}>
        <PageTop updateFilters={updateFilters} />
        <Switch>
          <Route path={"/create-dao"}>
            <Views.CreateDao account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/create-dao-proposal"}>
            <Views.CreateVoting account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/daos"}>
            <Views.Daos account={account}/>
          </Route>
          <Route path={"/members"}>
            <Views.Members account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/votings/:args"}>
            <Views.Home filters={filters} account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/votings"}>
            <Views.Home filters={filters} account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/"}>
            <Views.Home filters={filters} account={account} setModal={setCurrentOpen}/>
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
