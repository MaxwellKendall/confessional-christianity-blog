import React, { useState } from "react"
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
const DEFAULT_MAX = 10;

const BlogIndex = ({
  data,
  location,
}) => {
  const queryParams = new URLSearchParams(location.search)
  const search = queryParams.get('q') || '';
  const [postLimit, setPostLimit] = useState(DEFAULT_MAX);
  const posts = data.allWpPost.nodes
  
  const handleChange = (e) => {
    e.persist();
    navigate(`/?q=${e.target.value.replaceAll(URL_REGEX, '%20')}`);
  }
  
  const handleLoadMore = (e) => {
    e.preventDefault();
    setPostLimit(postLimit + DEFAULT_MAX)
  }
  
  const handleClickTag = (name) => {
    navigate(`/?q=${name}`)
  }

  if (!posts.length) {
    return (
      <Layout isHomePage>
        <SEO title="Confessional Christianity Blog" />
        <Bio />
      </Layout>
    )
  }
  
  const filteredPosts = posts
  .filter((post) => {
      if (!search) return true;
      const cleanedTitle = post.title.toLowerCase().replaceAll(POST_REGEX, '');
      const cleanedExcerpt = post.excerpt.toLowerCase().replace(POST_REGEX, '');
      if (post.tags.nodes.some(({ name }) => name.toLowerCase().includes(search.toLowerCase()))) return true;
      if (post.title.toLowerCase().includes(search.toLowerCase()) || cleanedTitle.includes(search.toLowerCase())) return true;
      if (post.excerpt.toLowerCase().includes(search.toLowerCase()) || cleanedExcerpt.includes(search.toLowerCase())) return true;
      return false;
    })

  return (
    <Layout isHomePage>
      <SEO title="All posts" />
      <div className="w-full flex justify-center">
        <input className="p-2 rounded-md border-2 mx-auto" placeholder="Search posts" type="text" value={search} onChange={handleChange} />
      </div>
      <ol className="list-none">
        {filteredPosts
            .slice(0, postLimit)
            .map(post => {
              const title = post.title;
              const tags = post.tags.nodes;
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
                    <ul className="flex mt-2">
                      {
                        tags.map(({ name }, i) => {
                          // possibly return more stuff here :shrug:?
                          return (
                            <li onClick={(e) => handleClickTag(name)} className="cursor-pointer border-2 py-2 px-4 md:p-4 uppercase bold text-sm">
                              {name}
                            </li>
                          )
                        })  
                      }
                    </ul>
                  </article>
                </li>
              )
            })
          }
      </ol>
      {filteredPosts.length > postLimit && (
          <button className="flex mx-auto p-10" onClick={handleLoadMore}>LOAD MORE</button>
      )}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query WordPressPostArchive {
    allWpPost(
      sort: { fields: [date], order: DESC }
    ) {
      nodes {
        excerpt
        uri
        date(formatString: "MMMM DD, YYYY")
        title
        excerpt
        tags {
					nodes {
						name
          }
        }
      }
    }
  }
`
