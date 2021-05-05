import React, {useEffect, useState} from "react";
import {PlusIcon} from "@heroicons/react/solid";
import {Button, NavBar} from "@moosty/dao-storybook";
import {useHistory, useLocation} from "react-router-dom";

export const NavBarContainer = () => {
  const history = useHistory();
  const location = useLocation();
  const [navBarArgs, setNavBarArgs] = useState({
    user: {
      name: "Raphael",
      address: "klasjdflkasjdf",
    },
    logo: <img src={"/logo192.png"} className="h-10"/>,
    navigation: [
      {
        name: 'Votings',
        href: () => history.push('/'),
        path: '/',
        current: false,
      },
      {
        name: 'Members',
        href: () => history.push('/members'),
        path: '/members',
        current: false,
      },
      {
        name: 'DAOs',
        href: () => history.push('/daos'),
        path: '/daos',
        current: false,
      },
    ],
    ctaButton: <Button
      label="Create new Dao"
      shadow
      iconBefore
      icon={<PlusIcon className="h-5 w-5 -ml-2 mr-2"/>}
    />,
    userNavigation: [
      {name: 'Create a Dao', href: () => alert("Create a dao")},
      {name: 'Create a voting', href: () => alert("Create a voting")},
      {name: 'Sign out', href: () => alert("Sign out")},
    ],
    invitations: [
      {
        dao: "LiskCenterUtrecht",
        id: "aksldjflksjdflkjdsf",
      }
    ],
  })

  useEffect(() => {
    const newNavArgs = {...navBarArgs}
    newNavArgs.navigation = newNavArgs.navigation.map(n => ({
      ...n,
      current: n.path === location.pathname,
    }))
    setNavBarArgs({
      ...newNavArgs,
    })
  }, [location]);

  return (<NavBar
    {...navBarArgs}
  />)
}