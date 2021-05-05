import React, {useEffect, useState} from "react";
import {Container, BreadCrumbs} from "@moosty/dao-storybook";
import {Filters} from "./Filters";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";

export const PageTop = () => {
  const history = useHistory();
  const location = useLocation();
  const [crumbs, setCrumbs] = useState([]);
  const matches = {
    votings: useRouteMatch("/votings/:args"),
    members: useRouteMatch("/members/:args"),
    daos: useRouteMatch("/daos/:args"),
  }

  useEffect(() => {
    const paths = location.pathname.split("/");
    let arg = ""
    const pathname = paths.length <= 2 ? location.pathname : Object.keys(matches).map(page => {
      if (matches[page]?.isExact) {
        arg = matches[page]?.params;
        return matches[page]?.path;
      }
      return null
    }).find(Boolean)

    switch (pathname) {
      case "/members":
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "Members",
            onClick: () => history.push("/members"),
          }
        ])
        break;
      case "/members/:args":
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "Members",
            onClick: () => history.push("/members"),
          },
          {
            name: arg.args,
            onClick: () => history.push(location.pathname),
          },
        ])
        break;
      case "/votings":
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "Votings",
            onClick: () => history.push("/votings"),
          }
        ])
        break;
      case "/votings/:args":
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "Votings",
            onClick: () => history.push("/votings"),
          },
          {
            name: arg.args,
            onClick: () => history.push(location.pathname),
          },
        ])
        break;
      case "/daos":
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "DAOs",
            onClick: () => history.push("/daos"),
          }
        ])
        break;
      case "/daos/:args":
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "DAOs",
            onClick: () => history.push("/daos"),
          },
          {
            name: arg.args,
            onClick: () => history.push(location.pathname),
          },
        ])
        break;
      default:
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "Votings",
            onClick: () => history.push("/votings"),
          }
        ])
        break;
    }
  }, [location]);

  return (<Container className="flex flex-row my-4 ">
    <BreadCrumbs crumbs={crumbs} className="flex-start w-full"/>
    <Filters className="flex flex-row justify-end w-full" />
  </Container>)
}