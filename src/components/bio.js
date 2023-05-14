/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = ({
  classNames = '',
  authorId
}) => {
  const { authors: { nodes: authors } } = useStaticQuery(graphql`
    query BioQuery {
      # if there was more than one user, this would need to be filtered
      authors: allWpUser {
        nodes {
          firstName
          id
          lastName
          twitter: name
          description
          avatar {
            url
          }
        }
      }
    }
  `)

  // author for this post
  const author = authors.find((o) => o.id === authorId);

  const avatarUrl = author?.avatar?.url

  return (
    <div className={`bio ${classNames}`}>
      {avatarUrl && (
        <img
          alt={author?.firstName || ``}
          className="bio-avatar"
          src={avatarUrl}
        />
      )}
      {author?.firstName && author?.lastName && (
        <p>
          Post from <strong>{`${author.firstName} ${author.lastName}`}</strong>.&nbsp;
          {author?.description || null}
        </p>
      )}
    </div>
  )
}

export default Bio
