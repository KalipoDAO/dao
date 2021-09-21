import React from "react";
import {BlogSection, Button, Container, Typography} from "@moosty/dao-storybook";
import {RocketSvg} from "@moosty/dao-storybook/dist/shared/themeSvgs";
import {useHistory} from "react-router-dom";
import {appWidth} from "@moosty/dao-storybook/dist/shared/styles";
import {blogPostsDAO} from "@moosty/dao-storybook/dist/fixtures/dao/blogsDAO";

export const LandingPage = () => {
  const history = useHistory();
  return (<>
      <Container
        className="flex flex-col lg:items-center  lg:flex-row-reverse my-10 lg:my-16 lg:justify-between min-h-screen">
        <div className="flex w-full lg:w-2/3 xl:w1/3 ">
          <img src={"/theme01.png"}/>
        </div>
        <div className="flex-col my-10 lg:my-auto w-full lg:w-1/3 ">
          <Typography type="sloganLarge" Element="h5" className="text-themeButtonBg  hidden lg:block">Together, we
            decide!</Typography>
          <Typography type="sloganSmall" Element="h5" className="text-themeButtonBg lg:hidden ">Together, we
            decide!</Typography>
          <Typography type="h3" Element="span" className="text-textBody my-auto ">Everyone is equally
            important</Typography>
          <Button
            onClick={() => history.push("/votings")}
            label="Get started!"
            iconBefore
            icon={<div className={"mr-2"}><RocketSvg/></div>}
            className="mt-8"
            shadow/>
        </div>
      </Container>
    <Container
      className={["flex flex-col lg:flex-row justify-between my-4 space-x-20  lg:my-10"].join(" ")}>
      <div className="flex flex-col w-full lg:w-1/2  mb-4">
        <Typography type="h1" Element="h1">Kalipo</Typography>
        <Typography type="body" Element="span">A DAO platform to support online collaborations with the right tools, helpful insights and pre-made templates.
          The current Proof of Concept provides voting as a valuable governance tool. This gives community members the
          possibility to exert influence and to express their viewpoints. However, votings consume time and energy of
          the voters and a voting committee. This often results in poor voter attendance and even in invalid votings.
          Kalipo solves this problem by making votings easy.
        </Typography>
      </div>
      <div className="flex flex-col  w-full lg:w-1/2 ">
        <Typography type="h1" Element="h1">About the Kalipo team</Typography>
        <Typography type="body" Element="span">Kalipo is a project run by a diverse group of professionals. With the Lisk Center Utrecht as their base. The technical side of the project is the responsibility of the Moosty team, a blockchain development studio. Xinrong Ding takes care that all our choices are user-centric. Peter Nobels combines the both with his broad knowledge of business concepts and ecosystems. Together, we make sure Kalipo is feasible, desirable, and viable.
          <a href="https://lisk.chat/" target="_blank" rel="noopener noreferrer" className="hover:underline">
            {` `}Reach out to us through Discord
          </a>&nbsp; or follow us on <a href="https://twitter.com/KalipoDAO/" target="_blank" rel="noopener noreferrer" className="hover:underline">twitter</a> & <a href="https://kalipo.medium.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">medium</a> </Typography>
      </div>
    </Container>
    <Container className={["flex", "flex-row "].join(" ")}>
      <BlogSection title="Blogs" descriptionTop="" blogPosts={blogPostsDAO}/>
    </Container></>)
}