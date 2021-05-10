import React, {useEffect} from "react";
import {FilterWrapper} from "@moosty/dao-storybook";
import {allDaoData} from "@moosty/dao-storybook/dist/fixtures/daos";
import {allMembers} from "@moosty/dao-storybook/dist/fixtures/members";
import {allVotingTypes} from "@moosty/dao-storybook/dist/fixtures/votingTypes";
import {useDaos} from "../hooks/daos";
import {useMembers} from "../hooks/members";

export const Filters = ({hidden}) => {
  const {daos} = useDaos();
  const {members} = useMembers();

  useEffect(() => {
    console.log(hidden)
  },[hidden])

  const filters = [
    {
      label: "Select DAO",
      items: [allDaoData[0], ...daos].map(d => ({
        id: d.id,
        name: d.name,
        icon: `https://avatar.moosty.com/${d.id}`,
      })),
      selected: {
        ...allDaoData[0],
      },
    },
    {
      label: "Initiated by Anyone",
      items: [{
        ...allMembers[0],
        icon: 'https://avatar.moosty.com/1',
      },
        ...members],
      selected: {
        icon: 'https://avatar.moosty.com/1',
        ...allMembers[0],
      },
    },
    {
      label: "Open and Closed",
      items: allVotingTypes,
      selected: {
        ...allVotingTypes[0],
      },
    },
  ]

  return (<div className={hidden && 'hidden'}>
    <FilterWrapper filters={filters}/>
  </div>)
}