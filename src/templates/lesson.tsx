import { CompleteLessonButton } from "@components/coaching/CompleteLessonButton"
import { useGetLesson, useUpdateCoaching } from "@hooks/useCoaching"
import { useGetActiveCoaching } from "@hooks/useUser"
import { graphql, PageProps } from "gatsby"
import Image, { FluidObject } from "gatsby-image"
import { useTranslation } from "gatsby-plugin-react-i18next"
import React, { FC } from "react"
import styled from "styled-components"
import { ContentfulLesson, LessonByIdQuery } from "../../graphql-types"
import AuthorCard from "@components/author/AuthorCard"
import BookmarkButton from "@components/bookmark/Bookmark"
import HabitCard from "@components/habit/HabitCard"
import HtmlContent, { H1, H3, H4 } from "@components/html/Html"
import Layout from "@components/Layout/Layout"
import LargeLessonCard from "@components/lesson/LargeLessonCard"
import { Container, TextContainer } from "@components/Primitives"
import SEO from "@components/SEO/SEO"
import TagSection from "@components/tags/Tags"
import getFirstAuthor from "@helpers/author"
import {
  useAddBookmark,
  useDeleteBookmark,
  useGetBookmark,
} from "@hooks/useBookmarks"
import { isLoggedIn } from "@auth/auth"

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
      authorCard,
      additionalInformation: readMore,
      habit: habits,
    },
  } = data as {
    contentfulLesson: ContentfulLesson
    nextLesson: ContentfulLesson
    previousLesson: ContentfulLesson
  }

  const description = content?.fields?.excerpt
  const { t } = useTranslation()
  const {
    data: { bookmarked, id },
    isLoading,
  } = useGetBookmark(slug as string, "lesson")
  const [remove, { isLoading: removeLoading }] = useDeleteBookmark()
  const [add, { isLoading: addLoading }] = useAddBookmark()
  const [update, { isLoading: completeLoading }] = useUpdateCoaching()
  const { data: activeCoaching } = useGetActiveCoaching()
  const { data: lessonCompleted } = useGetLesson(slug as string)

  console.log(lessonCompleted, "lessonCompleted")

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
    await update({
      coaching: {
        id: activeCoaching?.id as string,
        lessons: [slug],
      },
    })
  }

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
        author={getFirstAuthor(authorCard)}
      />

      <TextContainer>
        <TitleContainer>
          <H1>{title}</H1>
        </TitleContainer>

        <Cover>
          <CoverImage fluid={cover?.fluid as FluidObject} />
        </Cover>

        <ActionRow>
          <CompleteLessonButton
            onClick={handleComplete}
            loading={completeLoading}
            completed={lessonCompleted}
          />
          <BookmarkButton
            onClick={handleBookmarking}
            bookmarked={bookmarked}
            loading={removeLoading || addLoading || isLoading}
          />
        </ActionRow>

        {isLoggedIn() ? <HtmlContent document={content?.json} /> : null}

        {habits && <H3>{t("HABITS_TO_TRY")}</H3>}

        <Habits>
          {habits?.map((habit) => (
            <HabitCard
              link
              key={`${habit?.slug}`}
              title={habit?.title}
              period={habit?.period}
              slug={`/habit/${habit?.slug}`}
              excerpt={habit?.description?.fields?.excerpt}
            />
          ))}
        </Habits>
        {readMore && (
          <>
            <H3>{t("ADDITIONAL_READING")}</H3>
            <HtmlContent document={readMore.json} />
          </>
        )}

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
  margin: 5rem 0rem;
  height: 30rem;
  max-height: 50vh;
  width: 100%;
  box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.2),
    0 18px 36px -18px rgba(0, 0, 0, 0.22);
`

const CoverImage = styled(Image)`
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
  text-align: center;
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
