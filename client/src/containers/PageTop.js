import React, {useEffect, useState} from "react";
import {Container, BreadCrumbs} from "@moosty/dao-storybook";
import {Filters} from "./Filters";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";

export const PageTop = ({updateFilters, filters}) => {
  const history = useHistory();
  const location = useLocation();
  const [crumbs, setCrumbs] = useState([]);
  const [filtersHidden, setFiltersHidden] = useState(false);
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
        setFiltersHidden(true);
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
        setFiltersHidden(true);
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
        setFiltersHidden(false);
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
        setFiltersHidden(false);
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
        setFiltersHidden(true);
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
        setFiltersHidden(true);
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
      case "/create-dao":
        setFiltersHidden(true);
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
            name: "Create DAO",
            onClick: () => history.push("/create-dao"),
          },
        ])
        break;
      case "/create-dao-proposal":
        setFiltersHidden(true);
        setCrumbs([
          {
            name: "Home",
            onClick: () => history.push("/"),
          },
          {
            name: "Proposals",
            onClick: () => history.push("/votings"),
          },
          {
            name: "Create Proposal",
            onClick: () => history.push("/create-dao-proposal"),
          },
        ])
        break;
      default:
        setFiltersHidden(true);
        setCrumbs([])
        break;
    }
  }, [location]);

  return (<Container className="flex flex-row my-4 ">
    <BreadCrumbs crumbs={crumbs} className="flex-start w-full"/>
    <Filters selectedItems={filters} updateFilters={updateFilters} hidden={filtersHidden} className="flex flex-row justify-end w-full" />
  </Container>)
}