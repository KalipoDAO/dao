import React, {useContext, useEffect, useState} from "react";
import {Container, VotingContainer,} from "@moosty/dao-storybook";
import {allCardsData} from "@moosty/dao-storybook/dist/fixtures/cards";
import {AppContext} from "../appContext";

export const Home = () => {
  const {getClient} = useContext(AppContext)
  const [votings, setVotings] = useState([]);
  const [parsedVotings, setParsedVotings] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(100);
  useEffect(() => {
    const getVotings = async () => {
      const client = await getClient;
      setVotings((await client.invoke("dao:getAllProposals", {offset, limit})).data)
    }
    getVotings()
  }, [getClient])

  useEffect(() => {
    const getDaos = async () => {
      const client = await getClient;
      const info = await client.invoke("app:getNodeInfo")
      const daoIds = Array.from(new Set(votings?.map(v => v.dao)))
      const daos = await Promise.all(daoIds?.map(async dao => {
        return await client.invoke("dao:getDao", {id: dao})
      }))
      setParsedVotings(votings?.map(v => {
        console.log(v)
        const dao = daos?.find(d => d.id === v.dao)
        return {
          dao: dao.name,
          eligibleVotes: dao.members.filter(m => m.nonce <= v.nonce).length,
          end: v.end,
          start: v.start,
          height: info.height,
          minToWin: v.rules.minToWin,
          quorum: v.rules.quorum,
          yes: v.votes.filter(vote =>
            vote.options[0].id === "8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d").length,
          no: v.votes.filter(vote =>
            vote.options[0].id === "9390298f3fb0c5b160498935d79cb139aef28e1c47358b4bbba61862b9c26e59").length,
          title: v.description,
          user: {
            address: v.creator,
            username: "",
          },
          notAllowed: true,
        }
      }))
    }
    getDaos();
  }, [votings])

  useEffect(() => {
    console.log(parsedVotings, allCardsData[0])
  }, [parsedVotings])

  return <div>
    <Container>
      <div className="flex flex-row flex-wrap content-start justify-start space-x-5 space-y-8">
        {parsedVotings?.map((card, i) => <VotingContainer className={i === 0 && "ml-5 mt-8"} {...card} />)}
      </div>
    </Container>
  </div>
}