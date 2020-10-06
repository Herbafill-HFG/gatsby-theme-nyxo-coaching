import React, { FC } from "react"
import styled from "styled-components"
import {
  FacebookShareCount,
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share"
import { Icon } from "@components/Icons"

type Props = {
  shareUrl?: string
  summary: string
  title: string
}

export const SharingOptions: FC<Props> = ({ shareUrl, title, summary }) => {
  const url = typeof window !== "undefined" ? window.location.href : ""

  return (
    <Container>
      <Email url={url} subject={title} body={summary}>
        <EmailIcon />
      </Email>

      <Facebook url={url} quote={summary}>
        <FacebookIcon />
      </Facebook>

      <LinkedIn url={url} title={title} summary={summary} source="nyxo.app">
        <LinkedInIcon />
      </LinkedIn>

      <Twitter url={url} title={title} via="helloNyxo" related={["helloNyxo"]}>
        <TwitterIcon />
      </Twitter>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  flex-direction: row;
`

const Email = styled(EmailShareButton)``

export const EmailIcon = styled(Icon).attrs(({ theme }) => ({
  fill: "none",
  stroke: theme.SECONDARY_TEXT_COLOR,
  name: "emailSend",
  height: 30,
}))`
  margin: 0px;
  flex: 1;
`

const Facebook = styled(FacebookShareButton)``

const FacebookIcon = styled(Icon).attrs(({ theme }) => ({
  fill: "none",
  stroke: theme.SECONDARY_TEXT_COLOR,
  name: "facebook",
  height: 30,
}))`
  margin: 0px;
  flex: 1;
`

const LinkedIn = styled(LinkedinShareButton)``

const LinkedInIcon = styled(Icon).attrs(({ theme }) => ({
  fill: "none",
  stroke: theme.SECONDARY_TEXT_COLOR,
  name: "linkedIn",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  height: 30,
}))`
  margin: 0px;
  flex: 1;
`

const Twitter = styled(TwitterShareButton)``

const TwitterIcon = styled(Icon).attrs(({ theme }) => ({
  fill: "none",
  stroke: theme.SECONDARY_TEXT_COLOR,
  name: "twitter",
  height: 30,
}))`
  margin: 0px;
  flex: 1;
`