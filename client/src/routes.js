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
  const {account, onLogin, onRegister, registerError, loadingSprinkler, onSignOut} = useAuth(setCurrentOpen);

  useEffect(() => {
    console.log(account)
  }, [account])

  return (
    <Router>
      <NavBarContainer
        onSignOut={() => onSignOut()}
        user={account}
        onLoginClick={() => setCurrentOpen("login")}
        onRegisterClick={() => setCurrentOpen("register")}
      />
      <div className="w-full md:w-app mx-auto min-h-screen">
        <PageTop/>
        <Switch>
          <Route path={"/create-dao"}>
            <Views.CreateDao account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/create-dao-proposal"}>
            <Views.CreateVoting account={account} setModal={setCurrentOpen}/>
          </Route>
          <Route path={"/daos"}>
            <Views.Home account={account}/>
          </Route>
          <Route path={"/members"}>
            <Views.Home account={account}/>
          </Route>
          <Route path={"/votings/:args"}>
            <Views.Home account={account}/>
          </Route>
          <Route path={"/votings"}>
            <Views.Home account={account}/>
          </Route>
          <Route path={"/"}>
            <Views.Home account={account}/>
          </Route>
        </Switch>
      </div>
      <Footer
        author={FooterAuthorDAO}
        items={FooterItemsDAO}
      />
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
