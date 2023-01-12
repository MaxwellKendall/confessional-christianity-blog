import React from "react"
import { Link, graphql, navigate } from "gatsby"
import parse from "html-react-parser"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { getPostPathWithoutDate } from "../helpers"

const handleFilter = (searchTerm) => {
  if (!searchTerm) return () => true;
  return (post) => {
    if (post.title.includes(searchTerm)) return true;
    const parsedExcerpt = parse(post.excerpt);
    if (parsedExcerpt.includes(searchTerm)) return true;
    return false;
  }
}

const URL_REGEX = /\s/g;
const POST_REGEX = /,|'/g

const BlogIndex = ({
  data,
  location,
  pageContext: { nextPagePath, previousPagePath },
}) => {
  const queryParams = new URLSearchParams(location.search)
  const search = queryParams.get('search') || '';
  const posts = data.allWpPost.nodes
  
  const handleChange = (e) => {
    e.persist();
    console.log(e.target.value);
    new URLSearchParams(e.target.value)
    navigate(`/?search=${e.target.value.replaceAll(URL_REGEX, '%20')}`);
  }
  
  const handleKeyDown = (e) => {
      e.persist();
    if (e.keyCode === 13) {
      navigate(`/?search=${search}`);
    }
  }

  if (!posts.length) {
    return (
      <Layout isHomePage>
        <SEO title="Confessional Christianity Blog" />
        <Bio />
      </Layout>
    )
  }

  return (
    <Layout isHomePage>
      <SEO title="All posts" />
      <div className="w-full flex justify-center">
        <input className="p-2 rounded-md border-2 mx-auto" placeholder="Search posts" type="text" value={search} onKeyDown={handleKeyDown} onChange={handleChange} />
      </div>
      <ol className="list-none">
        {posts.filter(
          (post) => {
            if (!search) return true;
            const cleanedTitle = post.title.toLowerCase().replaceAll(POST_REGEX, '');
            const cleanedExcerpt = post.excerpt.toLowerCase().replace(POST_REGEX, '');
            
            if (post.title.toLowerCase().includes(search.toLowerCase()) || cleanedTitle.includes(search.toLowerCase())) return true;
            if (post.excerpt.toLowerCase().includes(search.toLowerCase()) || cleanedExcerpt.includes(search.toLowerCase())) return true;
            return false;
          })
          .map(post => {
          const title = post.title
          return (
            <li key={post.uri} className="my-12 md:my-24">
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.uri} itemProp="url">
                      <span itemProp="headline">{parse(title)}</span>
                    </Link>
                  </h2>
                  <small>{post.date}</small>
                </header>
                <section itemProp="description">{parse(post.excerpt)}</section>
              </article>
            </li>
          )
        })}
      </ol>
      {previousPagePath && (
        <>
          <Link to={previousPagePath}>Previous page</Link>
          <br />
        </>
      )}
      {nextPagePath && <Link to={nextPagePath}>Next page</Link>}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query WordPressPostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(
      sort: { fields: [date], order: DESC }
      limit: $postsPerPage
      skip: $offset
    ) {
      nodes {
        excerpt
        uri
        date(formatString: "MMMM DD, YYYY")
        title
        excerpt
      }
    }
  }
`
