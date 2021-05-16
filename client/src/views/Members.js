import React, {useEffect} from "react";
import {useMembers} from "../hooks/members";
import {MemberCard} from "@moosty/dao-storybook";
import {useDaos} from "../hooks/daos";

export const Members = ({setModal}) => {
  const {members} = useMembers();
  const {getUserDaos} = useDaos();

  return (<div className="flex flex-row flex-wrap content-center space-x-5 space-y-8">
    {members?.map((member, i) => <div
      onClick={async () => {
        setModal({
          type: "member",
          childLabel: "Member of DAOs:",
          name: member.name,
          address: member.id,
          daos: await getUserDaos(member.id),
        })
      }}
      className={[
      i === 0 && "ml-5 mt-8",
      "w-auto pr-5 ",
    ].join(" ")} key={member.id}><MemberCard {...member} /></div>)}
  </div>)
}