import { isLoggedIn } from "@auth/auth"
import AuthorCard from "@components/author/AuthorCard"
import { CompleteLessonButton } from "@components/coaching/CompleteLessonButton"
import HabitCard from "@components/habit/HabitCard"
import { ContentBlock } from "@components/html/ContentBlock"
import HtmlContent, { H1, H3, H4 } from "@components/html/Html"
import Layout from "@components/Layout/Layout"
import LargeLessonCard from "@components/lesson/LargeLessonCard"
import { Container, TextContainer } from "@components/Primitives"
import SEO from "@components/SEO/SEO"
import { SharingOptions } from "@components/sharing/SharingOptions"
import TagSection from "@components/tags/Tags"
import { getFirstAuthor } from "@helpers/author"
import {
  useAddBookmark,
  useDeleteBookmark,
  useGetBookmark,
} from "@hooks/useBookmarks"
import { useCompleteLesson, useGetLesson } from "@hooks/useCoaching"
import { useGetActiveCoaching } from "@hooks/useUser"
import { format } from "date-fns"
import { graphql, PageProps } from "gatsby"
import Image, { FluidObject, GatsbyImageProps } from "gatsby-image"
import { useTranslation } from "gatsby-plugin-react-i18next"
import React, { FC } from "react"
import styled from "styled-components"
import { ContentfulLesson, LessonByIdQuery } from "../../graphql-types"

const Lesson: FC<PageProps<LessonByIdQuery, { locale: string }>> = ({
  data,
  location: { pathname },
}) => {
  const {
    nextLesson,
    previousLesson,
    contentfulLesson: {
      lessonName: title = "",
      lessonContent: content,
      slug,
      createdAt,
      updatedAt,
      cover,
      keywords,
      fields,
      weights,
      authorCard,
      additionalInformation: readMore,
      habit: habits,
    },
  } = data as {
    contentfulLesson: ContentfulLesson
    nextLesson: ContentfulLesson
    previousLesson: ContentfulLesson
  }
  const description = fields?.excerpt
  const { t } = useTranslation()
  const {
    data: { bookmarked, id },
    isLoading,
  } = useGetBookmark(slug as string, "lesson")
  const [remove, { isLoading: removeLoading }] = useDeleteBookmark()
  const [add, { isLoading: addLoading }] = useAddBookmark()
  const [update, { isLoading: completeLoading }] = useCompleteLesson()
  const { data: activeCoaching } = useGetActiveCoaching()
  const { data: lessonCompleted } = useGetLesson(slug as string)

  const handleBookmarking = async () => {
    if (bookmarked) {
      remove({ id: id, type: "lesson" })
    } else {
      await add({
        name: title,
        slug: slug as string,
        type: "lesson",
      })
    }
  }

  const handleComplete = async () => {
    const existingLessons = activeCoaching?.lessons ?? []
    await update({
      lesson: slug as string,
      id: activeCoaching?.id as string,
      existingLessons,
    })
  }

  const mainAuthor = getFirstAuthor(authorCard)
  return (
    <Layout>
      <SEO
        pathName={pathname}
        title={title}
        description={description}
        published={createdAt}
        updated={updatedAt}
        image={cover?.fixed?.src}
        category="Health"
        tags="Sleep"
        author={mainAuthor?.name}
      />

      <TextContainer>
        <TitleContainer>
          <H1>{title}</H1>
          <Author>
            <Avatar fluid={mainAuthor?.avatar?.fluid as FluidObject} />
            <Column>
              <Name>{mainAuthor?.name}</Name>
              {updatedAt && (
                <Info>{format(new Date(updatedAt), "MMM dd")}</Info>
              )}
              <Info> · </Info>
              {fields?.readingTime && (
                <Info>{`${fields?.readingTime} min read`}</Info>
              )}
            </Column>
          </Author>
        </TitleContainer>

        <SharingOptions
          title={title as string}
          summary={description as string}
          bookmark={handleBookmarking}
          bookmarked={bookmarked}
          loading={removeLoading || addLoading || isLoading}
        />

        <Cover>
          <CoverImage fluid={cover?.fluid as FluidObject} />
        </Cover>

        {isLoggedIn() ? (
          <ActionRow>
            <CompleteLessonButton
              onClick={handleComplete}
              loading={completeLoading}
              completed={lessonCompleted}
            />
          </ActionRow>
        ) : null}

        {/* <div>{JSON.stringify(weights)}</div> */}

        <ContentBlock preview={content} slug={`${slug}`}>
          <HtmlContent document={content} />
          {habits && <H3>{t("HABITS_TO_TRY")}</H3>}
          <Habits>
            {habits?.map((habit) => (
              <HabitCard
                link
                key={`${habit?.slug}`}
                title={habit?.title}
                period={habit?.period}
                slug={`/habit/${habit?.slug}`}
                excerpt={habit?.fields?.excerpt}
              />
            ))}
          </Habits>
          {readMore && (
            <>
              <H3>{t("ADDITIONAL_READING")}</H3>
              <HtmlContent document={readMore} />
            </>
          )}
        </ContentBlock>

        <H4>{t("LESSON_BY")}</H4>
        <Authors>
          {authorCard?.map((author) => (
            <AuthorCard key={`${author?.slug}`} author={author} />
          ))}
        </Authors>

        <H4>{t("TAGS")}</H4>
        <Tags>
          <TagSection tags={keywords} />
        </Tags>
      </TextContainer>

      <Container>
        <hr />
        <MoreLessonsContainer>
          {previousLesson && (
            <LargeLessonCard
              path={`/lesson/${previousLesson.slug}`}
              lesson={previousLesson}
            />
          )}
          {nextLesson && (
            <LargeLessonCard
              path={`/lesson/${nextLesson.slug}`}
              lesson={nextLesson}
            />
          )}
        </MoreLessonsContainer>
      </Container>
    </Layout>
  )
}

export default Lesson

export const pageQuery = graphql`
  query LessonById(
    $slug: String!
    $locale: String!
    $previous: String
    $next: String
  ) {
    contentfulLesson(slug: { eq: $slug }, node_locale: { eq: $locale }) {
      ...LessonFragment
    }
    nextLesson: contentfulLesson(
      slug: { eq: $next }
      node_locale: { eq: $locale }
    ) {
      ...LessonFragment
    }
    previousLesson: contentfulLesson(
      slug: { eq: $previous }
      node_locale: { eq: $locale }
    ) {
      ...LessonFragment
    }
  }
`

export const Authors = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2rem -0.5rem;
  flex-wrap: wrap;
`

const ActionRow = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const Cover = styled.div`
  margin: 1.5rem 0rem 2.5rem;
  height: 30rem;
  max-height: 50vh;
  width: 100%;
  box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.2),
    0 18px 36px -18px rgba(0, 0, 0, 0.22);
`

const CoverImage = styled(Image)<GatsbyImageProps>`
  height: 100%;
  width: 100%;
`

const Habits = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0rem -0.5rem;
`

const TitleContainer = styled.div`
  text-align: left;
`

const MoreLessonsContainer = styled.div`
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  margin: 2rem -0.5rem 1rem;
`

const Tags = styled.div`
  margin: 0rem -0.3rem 2rem;
`

const Author = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Avatar = styled(Image)<GatsbyImageProps>`
  height: 3rem;
  width: 3rem;
  border-radius: 3rem;
  margin-right: 0.5rem;
`

const Info = styled.span`
  font-family: ${({ theme }) => theme.FONT_MEDIUM};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 0.5rem;
`
const Column = styled.div``

const Name = styled.div`
  font-family: ${({ theme }) => theme.FONT_MEDIUM};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.PRIMARY_TEXT_COLOR};
  margin-bottom: 0.5rem;
`
