import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// This is i18n and i10n
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl'

import { makeStyles } from '@material-ui/core/styles'

import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import {
  Collapse, List, ListSubheader, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, Badge
} from '@material-ui/core'

import CategoryIcon from '@material-ui/icons/Category'
import LabelIcon from '@material-ui/icons/Label'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { FluxCart } from 'quickcommerce-ui-cart'

import { actions as exampleActions } from '~/modules/example/redux'
import { exampleSelector } from '~/modules/example/store/selectors/exampleSelector'
import { ExampleWithError } from '~/modules/example'
import { ErrorBoundary } from '~/modules/utilities'

import { Breadcrumbs } from '~/core/components/breadcrumbs'
import { ProductCard } from '~/core/components/product-card'
import { ProductSearchForm } from '~/core/components/product-search-form'

import LazyLoading from '~/modules/lazy-loading'

import mecCatalogData from '~/../data.json'

// This is lazy loading example
const LazyExample = LazyLoading(() => import('~/modules/example/Example'))
const BreadcrumbsWithRouter = withRouter((props) => <Breadcrumbs {...props} />)

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  sidebarList: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  sidebarNestedList: {
    paddingLeft: theme.spacing(4),
  },
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  sidebar: {
    flexGrow: 1,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  catalogTools: {
    padding: `${theme.spacing(2)}px 0`,
  },
  content: {
    flexGrow: 2,
    // padding: `0 ${theme.spacing(3)}px`,
  },
  toolbar: theme.mixins.toolbar,
}))

function SidebarFilters({ items }) {
  const classes = useStyles()

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Grid item xs={12} sm={4} md={4} lg={3} xl={2} className={classes.sidebar}>
      <Typography component="h4">Filter By</Typography>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        /* subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Nested List Items
          </ListSubheader>
        } */
        className={classes.sidebarList}
      >
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {items.map((item, idx) => (
              <ListItem button className={classes.sidebarNestedList} key={idx}>
                <ListItemIcon>
                  <LabelIcon />
                </ListItemIcon>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="product count">
                    <Badge badgeContent={item.product_count} color="primary" style={{ marginRight: '1rem' }} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Grid>
  )
}

function CatalogPanel({ cart, items }) {
  const classes = useStyles()

  return (
    <Grid item xs={12} sm={8} md={8} lg={9} xl={10} className={classes.content}>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item key={item.id} xs={12} sm={12} md={6} lg={4} xl={3}>
            <ProductCard product={item.data} cart={cart} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

class ExampleView extends Component {
  static propTypes = {
    example: PropTypes.object.isRequired,
  }

  state = {
    myArbitraryNumber: Math.floor(Math.random() * 10000),
    currentTime: new Date(),
  }

  static contextTypes = {
    cartContextManager: PropTypes.object,
    cart: PropTypes.object,
  }

  constructor(props) {
    super(props)

    const mecProducts = mecCatalogData.products
    const products = mecProducts.map((product) => {
      // Map the object ID, in this case it's product_code
      return {
        id: product.product_code,
        quantity: 1,
        data: product,
        options: [],
      }
    })

    const mecCategories = mecCatalogData.categories.sub_categories
    const categories = mecCategories.map((category) => {
      // Map the object ID, in this case it's product_code
      return category
    })

    this.state = Object.assign({}, this.state, {
      products,
      categories,
      searchString: 'kayak',
    })
  }

  componentDidMount() {
    const { getAwesomeCode } = this.props
    const { products } = this.state
    const { cart } = this.context

    // TODO: See if this is reflected in child components
    cart.store.init({ items: {}, selection: products.slice(0,3) })
    this.forceUpdate()
    // TODO: Remove this, we're just hacking in some temp data

    console.log('dumping cart store')
    console.log(cart.store)

    getAwesomeCode()
    this.tempFetchData();
  }

  // TODO: Move this out, just a quick test...
  async tempFetchData() {
    const { searchString } = this.state
    console.log('fetch data')
    // TODO: Sanitize string
    const response = await fetch(`https://www.mec.ca/api/v1/products/search?keywords=${searchString}`, {
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Origin': 'http://localhost:8080',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.transformResponse(await response.json())
  }

  async setSearchString(searchString) {
    this.setState({ searchString }, () => {
      this.tempFetchData()
    })
  }

  transformResponse(responseData) {
    const mecProducts = responseData.products
    const products = mecProducts.map((product) => {
      // Map the object ID, in this case it's product_code
      return {
        id: product.product_code,
        quantity: 1,
        data: product,
        options: [],
      }
    })

    const mecCategories = responseData.categories.sub_categories
    const categories = mecCategories.map((category) => {
      // Map the object ID, in this case it's product_code
      return category
    })

    this.setState({ categories, products })
  }


  render() {
    const { myArbitraryNumber, currentTime, products, categories } = this.state
    const { cart, cartContextManager } = this.context

    // Note for i18n and i10n
    // if `id` is found, it will use the matched message
    // otherwise, it will use defaultMessage as fallback

    console.log('cart context + contextManager')
    console.log(cart)
    console.log(cartContextManager)

    return (
      <div style={{ marginTop: '2rem' }}>
        <ErrorBoundary>
          <ExampleWithError {...this.props} />
          <FluxCart.Cart />
        </ErrorBoundary>
        <Grid container alignItems="center" justify="space-between" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <Grid item>
            <BreadcrumbsWithRouter />
          </Grid>
          <Grid item>
            <ProductSearchForm itemProperty="full_name" items={products.map((product) => product.data)} categories={categories} cart={cart} label="Search" />
          </Grid>
        </Grid>
        <Grid container justify="space-around">
          <SidebarFilters items={categories} />
          <CatalogPanel items={products} cart={cart} />
        </Grid>
        <div style={{ marginTop: '2rem' }}>
          <LazyExample {...this.props} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  example: exampleSelector(state),
})

const mapDispatchToProps = {
  ...exampleActions,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExampleView)
