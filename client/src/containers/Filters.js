import React, {useEffect} from "react";
import {FilterWrapper} from "@moosty/dao-storybook";
import {allDaoData} from "@moosty/dao-storybook/dist/fixtures/daos";
import {allMembers} from "@moosty/dao-storybook/dist/fixtures/members";
import {allVotingTypes} from "@moosty/dao-storybook/dist/fixtures/votingTypes";
import {useDaos} from "../hooks/daos";
import {useMembers} from "../hooks/members";

export const Filters = ({hidden, updateFilters}) => {
  const {daos} = useDaos();
  const {members} = useMembers();

  const filters = [
    {
      onChange: (value) => updateFilters("dao", value),
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
      onChange: (value) => updateFilters("creator", value),
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
      onChange: (value) => updateFilters("state", value),
      label: "Open and Closed",
      items: allVotingTypes,
      selected: {
        ...allVotingTypes[1],
      },
    },
  ]

  return (<div className={hidden && 'hidden'}>
    <FilterWrapper filters={filters} defaultShow={false}/>
  </div>)
}