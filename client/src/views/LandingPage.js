import React from "react";
import {Container, Typography, Button,} from "@moosty/dao-storybook";
import {DaoLandingThemeSvg, RocketSvg} from "@moosty/dao-storybook/dist/shared/themeSvgs";
import {useHistory} from "react-router-dom";

export const LandingPage = () => {
  const history = useHistory();
  return (<Container className="flex flex-col lg:items-center  lg:flex-row-reverse my-10 lg:my-16 lg:justify-between">

    <div className="flex w-full  lg:w-2/3 ">
    <DaoLandingThemeSvg/>
    </div>
  <div className="flex flex-col my-10 lg:my-auto w-full lg:w-1/3 ">
    <Typography type="sloganLarge" Element="h5" className="text-themeButtonBg  hidden lg:block">Together, we decide!</Typography>
    <Typography type="sloganSmall" Element="h5" className="text-themeButtonBg lg:hidden ">Together, we decide!</Typography>
    <Typography type="h3" Element="span" className="text-textBody my-auto ">Everyone is equally important</Typography>
    <Button onClick={() => history.push("/votings")} label="Get started!" iconBefore icon={<RocketSvg />} className="mt-8 w-2/7 lg:w-3/7" shadow />
  </div>
</Container>)
}