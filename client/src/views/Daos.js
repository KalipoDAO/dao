import React, {useEffect} from "react";
import {MemberCard} from "@moosty/dao-storybook"
import {useDaos} from "../hooks/daos";
import {useMembers} from "../hooks/members";

export const Daos = ({setModal}) => {
  const {daos} = useDaos();
  const {members} = useMembers();

  return (<div className="flex flex-row flex-wrap content-center  space-x-5 space-y-8">
    {members && daos?.map((dao, i) => <div
      onClick={() => {
        setModal({
          type: "dao",
          childLabel: "Members:",
          name: dao.name,
          id: dao.id,
          members: dao.members.map(member => ({name: members.find(m => member.id === m.id)?.name})),
        })
      }}
        className={[
        i === 0 && "ml-5 mt-8",
        "w-auto pr-5 ",
        ].join(" ")} key={dao.id}><MemberCard address={dao.id} name={dao.name}/></div>)}
      </div>)
      }