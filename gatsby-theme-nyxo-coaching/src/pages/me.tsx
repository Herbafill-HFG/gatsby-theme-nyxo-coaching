import { Router, Redirect } from "@reach/router"
import React, { FC, useContext } from "react"
import Details from "@components/user/pages/Details"
import Login from "@components/user/pages/Login"
import PrivateRoute from "@components/auth/PrivateRoute"
import SignUp from "@components/user/pages/Register"
import Reset from "@components/user/pages/Reset"
import Layout from "@components/Layout/Layout"
import Sleep from "@components/user/pages/Sleep"
import { I18nextContext } from "gatsby-plugin-react-i18next"
import { PageProps } from "gatsby"

const Me: FC<PageProps> = () => {
  return (
    <Layout>
      <Router>
        <PrivateRoute path={`me/`} component={Details} />
        <PrivateRoute path={`me/sleep`} component={Sleep} />
        <Login path={`me/login`} />
        <SignUp path={`me/register`} />
        <Reset path={`me/reset`} />
      </Router>
    </Layout>
  )
}

export default Me
