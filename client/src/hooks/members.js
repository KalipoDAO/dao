import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const {getClient} = useContext(AppContext);

  useEffect(() => {
    const getMembers = async () => {
      const client = await getClient;
      const membersList = await client.invoke("sprinkler:getAllUsernames");
      if (membersList?.length > 0) {
        setMembers(membersList.map(m => ({
          id: m.ownerAddress,
          icon: `https://avatar.moosty.com/${m.ownerAddress}`,
          address: m.ownerAddress,
          name: m.username,
        })))
      }
    }
    getMembers()
  }, [])

  return {
    members,
  }
}