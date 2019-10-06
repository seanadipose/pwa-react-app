import React, { PureComponent } from 'react'

import { Breadcrumbs, Link, Typography } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import { makeStyles } from '@material-ui/core/styles'

import styles from './Header.css'

const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    padding: `${theme.spacing(3)}px 0`,
  }
}))

export default function Header(props) {
  const { location } = props
  const { pathname } = location

  const classes = useStyles()

  const isHome = pathname === '/'
  const isJustAnotherPage = pathname === '/page'

  function handleClick(event) {
    event.preventDefault()
    alert('You clicked a breadcrumb.')
  }

  return (
    <header className={styles.globalHeader}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        className={classes.breadcrumbs}
      >
        <Link color="inherit" href="/" onClick={handleClick}>
          Categories
        </Link>
        <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
          Suits
        </Link>
        <Typography color="textPrimary">Breadcrumb</Typography>
      </Breadcrumbs>
      {/* <ul>
        <li className={!isHome ? styles.active : ''}>
          {isHome ? 'Home' : <Link to="/">Home</Link>}
        </li>
        <li className={!isJustAnotherPage ? styles.active : ''}>
          {isJustAnotherPage ? (
            'Just Another Page'
          ) : (
            <Link to="/page">Just Another Page</Link>
          )}
        </li>
      </ul> */}
    </header>
  )
}
