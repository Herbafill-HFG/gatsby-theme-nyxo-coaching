import React, { FC, ReactNode } from "react"
import {
  Block,
  BLOCKS,
  Document,
  Inline,
  INLINES,
  MARKS,
  Text,
} from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import {
  Options,
  documentToReactComponents,
} from "@contentful/rich-text-react-renderer"
import styled from "styled-components"
import Image, { GatsbyImageProps } from "gatsby-image"
import { useImageZoom } from "react-medium-image-zoom"
import HabitCard from "@components/habit/HabitCard"
import { ContentfulLessonAdditionalInformationRichTextNode } from "graphql-types"

interface ContentfulRichTextGatsbyReference {
  __typename: string
  contentful_id: string
}

interface RenderRichTextData<T extends ContentfulRichTextGatsbyReference> {
  raw: string
  references: T[]
}

type Props = {
  document?:
    | RenderRichTextData
    | ContentfulLessonAdditionalInformationRichTextNode
}

export interface RenderNode {
  [k: string]: NodeRenderer
}

export interface NodeRenderer {
  (node: Block | Inline, children: ReactNode): ReactNode
}

export type CommonNode = Text | Block | Inline

export const getContentType = (
  node: Inline
): { type: string; path: string; title: string } => {
  switch (node?.data?.target?.sys.contentType.sys.id) {
    case "habit": {
      const path = node?.data?.target?.fields?.slug["en-US"]
      const name = node?.data?.target?.fields?.title["en-US"]
      return { type: "habit", path: `/habit/${path}`, title: name }
    }
    case "lesson": {
      const path = node?.data?.target?.fields?.slug["en-US"]
      const name = node?.data?.target?.fields?.lessonName["en-US"]
      return { type: "lesson", path: `/lesson/${path}`, title: name }
    }
    default:
      return { type: "unknown", path: "", title: "" }
  }
}

function defaultInline(type: string, node: Inline): ReactNode {
  if (node?.data?.target?.__typename === "ContentfulHabit") {
    return (
      <HabitCard
        slug={`/habit/${node.data.target.slug}`}
        title={node.data.target.title}
        period={node.data.target.period}
        excerpt={node.data.target.fields.excerpt}
        link
      />
    )
  }

  return null
  // <Link to={`${contentType.path}`} key={node.data.target.sys.id}>
  //   {contentType.title}
  // </Link>
}

/* eslint-disable react/display-name */
const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text: ReactNode) => <Bold>{text}</Bold>,
    [MARKS.ITALIC]: (text: ReactNode) => <I>{text}</I>,
    [MARKS.UNDERLINE]: (text: ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: ReactNode) => <code>{text}</code>,
  },
  renderNode: {
    [BLOCKS.DOCUMENT]: (node: CommonNode, children: ReactNode) => children,
    [BLOCKS.PARAGRAPH]: (node: CommonNode, children: ReactNode) => (
      <P>{children}</P>
    ),
    [BLOCKS.HEADING_1]: (node: CommonNode, children: ReactNode) => (
      <h1>{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: CommonNode, children: ReactNode) => (
      <H2>{children}</H2>
    ),
    [BLOCKS.HEADING_3]: (node: CommonNode, children: ReactNode) => (
      <H3>{children}</H3>
    ),
    [BLOCKS.HEADING_4]: (node: CommonNode, children: ReactNode) => (
      <H4>{children}</H4>
    ),
    [BLOCKS.HEADING_5]: (node: CommonNode, children: ReactNode) => (
      <H5>{children}</H5>
    ),
    [BLOCKS.HEADING_6]: (node: CommonNode, children: ReactNode) => (
      <H6>{children}</H6>
    ),
    [BLOCKS.EMBEDDED_ENTRY]: (node: CommonNode, children: ReactNode) => (
      <div>{children}</div>
    ),
    [BLOCKS.UL_LIST]: (node: CommonNode, children: ReactNode) => (
      <Ul>{children}</Ul>
    ),
    [BLOCKS.OL_LIST]: (node: CommonNode, children: ReactNode) => (
      <Ol>{children}</Ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: CommonNode, children: ReactNode) => (
      <Li>{children}</Li>
    ),
    [BLOCKS.QUOTE]: (node: CommonNode, children: ReactNode) => (
      <BlockQuote>{children}</BlockQuote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => <ImageBlock node={node} />,
    [BLOCKS.HR]: () => <hr />,
    [INLINES.ASSET_HYPERLINK]: (node: CommonNode) =>
      defaultInline(INLINES.ASSET_HYPERLINK, node as Inline),
    [INLINES.ENTRY_HYPERLINK]: (node: CommonNode) =>
      defaultInline(INLINES.ENTRY_HYPERLINK, node as Inline),
    [INLINES.EMBEDDED_ENTRY]: (node: CommonNode) =>
      defaultInline(INLINES.EMBEDDED_ENTRY, node as Inline),
    [INLINES.HYPERLINK]: (node: CommonNode, children: ReactNode) => (
      <A href={node.data.uri}>{children}</A>
    ),
  },
}

const HtmlContent: FC<Props> = ({ document }) => {
  return <>{document && renderRichText(document, options)}</>
}

export const HtmlContentWithoutEmbeds: FC<Props> = ({ document }) => {
  return <>{document && documentToReactComponents(document, options)}</>
}

export default HtmlContent

export const P = styled.p`
  font-size: 1.15rem;
  line-height: 2rem;
  margin-bottom: 2rem;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.PRIMARY_TEXT_COLOR};
`

const Bold = styled.b`
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
`

const I = styled.i`
  font-style: italic;
`

export const H1 = styled.h1`
  margin: 3.5rem 0rem 2rem;
  font-size: 2.5rem;
  font-family: var(--semibold);
  font-weight: bold;
  font-style: normal;
  color: ${({ theme }) => theme.titleColor};
  line-height: 5rem;
`

export const H2 = styled.h2`
  margin: 3.5rem 0rem 2rem;
  font-family: var(--semibold);
  font-weight: bold;
  font-style: normal;
  font-size: 2rem;
  color: ${({ theme }) => theme.titleColor};
`

export const H3 = styled.h3`
  margin: 3.5rem 0rem 2rem;
  font-size: 1.8rem;
  font-family: var(--semibold);
  font-weight: bold;
  font-style: normal;
  color: ${({ theme }) => theme.titleColor};
`

export const H4 = styled.h4`
  margin: 3.5rem 0rem 2rem;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.titleColor};
`

export const H5 = styled.h5`
  margin: 3.5rem 0rem 2rem;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.titleColor};
`

export const H6 = styled.h6`
  margin: 2.5rem 0rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.titleColor};
`

type ImageProps = {
  node: any
}

const ImageBlock: FC<ImageProps> = ({ node }) => {
  const { ref } = useImageZoom()

  return (
    <ImageContainer>
      <div ref={ref}>
        <Img fluid={node?.data?.target?.fluid} />
      </div>
      <ImageTitle>{node?.data?.target?.title}</ImageTitle>
      <ImageDescription>{node?.data?.target?.description}</ImageDescription>
    </ImageContainer>
  )
}

const ImageContainer = styled.figure`
  background-color: ${({ theme }) => theme.PRIMARY_BACKGROUND_COLOR};
`

const Img = styled(Image)<GatsbyImageProps>``

const ImageTitle = styled.figcaption`
  font-size: 0.9rem;
  line-height: 2rem;
  margin-bottom: 2rem;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.PRIMARY_TEXT_COLOR};
`
const ImageDescription = styled.figcaption`
  font-size: 0.9rem;
  line-height: 2rem;
  margin-bottom: 2rem;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.PRIMARY_TEXT_COLOR};
`

const Ol = styled.ol`
  counter-reset: cupcake;

  li {
    counter-increment: list;
    margin-bottom: 1rem;
    position: relative;
    padding-left: 32px;
    &:before {
      display: block;
      left: 0;
      top: 10px;
      font-size: 1.3rem;
      position: absolute;
      content: counter(list) ". ";
      color: ${({ theme }) => theme.titleColor};
      font-weight: bold;
      font-family: "Montserrat", sans-serif;
    }

    p {
      display: inline;
    }
  }
`

const Ul = styled.ul`
  counter-reset: cupcake;
  margin-bottom: 2rem;
  li {
    counter-increment: cupcake;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    &:before {
      display: inline;
      font-size: 2rem;
      line-height: 2rem;
      margin-right: 10px;
      position: relative;
      content: "•";
      color: rgb(44, 11, 142);
      font-weight: bold;
      font-family: Montserrat-semibold, sans-serif;
    }

    p {
      display: inline;
    }
  }
`

const Li = styled.li``

const BlockQuote = styled.blockquote``

const A = styled.a`
  &:after {
    content: "";
    position: absolute;
    left: -2px;
    right: -2px;
    bottom: 0px;
    height: 2px;
    border-radius: 2px;
    transition: transform 200ms ease 150ms, opacity 350ms ease 150ms;
  }
`
