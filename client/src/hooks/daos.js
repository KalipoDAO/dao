import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";

export const useDaos = () => {
  const [daos, setDaos] = useState([]);
  const {getClient} = useContext(AppContext);

  useEffect(() => {
    const getDaos = async () => {
      const client = await getClient;
      const dai = await client.invoke("dao:getAllDaos", {limit: 1000, offset: 0});
      if (dai?.meta?.count > 0) {
        setDaos(dai.data)
      }
    }
    getDaos()
  }, [])

  return {
    daos,
  }
}