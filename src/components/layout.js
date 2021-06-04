import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import parse from "html-react-parser"

const Layout = ({ isHomePage, children }) => {
  const {
    wp: {
      generalSettings: { title },
    },
  } = useStaticQuery(graphql`
    query LayoutQuery {
      wp {
        generalSettings {
          title
          description
        }
      }
    }
  `)

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <header className="global-header text-center">
        {isHomePage ? (
          <h1 className="main-heading font-normal">
            <Link to="/">{parse(title)}</Link>
          </h1>
        ) : (
          <Link className="header-link-home" to="/">
            {title}
          </Link>
        )}
      </header>
      <main className="main">
        {children}
      </main>
      <footer className="w-full flex justify-center items-center">
        © CONFESSIONAL CHRISTIANITY {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default Layout
