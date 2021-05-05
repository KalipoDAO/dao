import React from "react";
import {FilterWrapper} from "@moosty/dao-storybook";
import {allDaoData} from "@moosty/dao-storybook/dist/fixtures/daos";
import {allMembers} from "@moosty/dao-storybook/dist/fixtures/members";
import {allVotingTypes} from "@moosty/dao-storybook/dist/fixtures/votingTypes";

export const Filters = () => {
  const filters = [
    {
      label: "Select DAO",
      items: allDaoData,
      selected: {
        ...allDaoData[1],
      },
    },
    {
      label: "Initiated by Anyone",
      items: allMembers,
      selected: {
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

  return (<div>
    <FilterWrapper filters={filters} />
  </div>)
}