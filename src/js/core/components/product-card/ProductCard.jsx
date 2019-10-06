import React, { Fragment } from 'react'
import {
  Grid, Card, CardHeader, CardContent, CardMedia, CardActions, Avatar, Chip, IconButton, Button, Typography, Collapse,
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import InfoIcon from '@material-ui/icons/Info'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'

import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 'auto',
    // Make sure cardTop is absolutely positioned relative to the card
    position: 'relative',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  addToCart: {
    marginLeft: 'auto',
    marginRight: `${theme.spacing(2)}px`,
  },
  avatar: {
    backgroundColor: red[500],
  },
  rating: {
    marginTop: `${theme.spacing(1) / 2}px`,
  },
  reviewedBy: {
    marginLeft: `${theme.spacing(1)}px`,
  },
  productName: {
    margin: `${theme.spacing(2)}px 0`,
  },
  currency: {
    fontWeight: 'bold',
  },
  priceInteger: {
    fontWeight: 'bold',
  },
  priceFraction: {
    fontWeight: 'bold',
    fontSize: '70%',
    marginLeft: '2px',
    position: 'relative',
    top: '3px',
  },
  cardTop: {
    position: 'absolute',
    width: '100%',
  },
}))

export default function ProductCard({ product, cart }) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const formatPrice = (priceObj) => {
    return {
      units: priceObj.amount.toString().split('.')[0],
      fractions: (priceObj && priceObj.amount && priceObj.amount.toString().split('.').length > 1)
        ? priceObj.amount.toString().split('.')[1]
        : '00',
    }
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardTop}
        avatar={(
          <Chip
            label={(
              <Fragment>
                {product && product.list_price && product.clearance === true && (
                  <div>
                    <span className={classes.currency}>$</span>
                    <span className={classes.priceInteger}><s>{(product.list_price) ? formatPrice(product.list_price).units : ''}</s></span>
                    <sup className={classes.priceFraction}><s>{(product.list_price) ? `.${formatPrice(product.list_price).fractions}` : ''}</s></sup>
                  </div>
                )}

                {product && product.clearance_price && product.clearance === true && (
                  <div style={{ color: 'red', paddingLeft: '0.75rem' }}>
                    <span className={classes.currency}>$</span>
                    <span className={classes.priceInteger}>{(product.clearance_price) ? formatPrice(product.clearance_price).units : ''}</span>
                    <sup className={classes.priceFraction}>{(product.clearance_price) ? `.${formatPrice(product.clearance_price).fractions}` : ''}</sup>
                  </div>
                )}

                {product && product.list_price && product.clearance !== true && (
                  <div>
                    <span className={classes.currency}>$</span>
                    <span className={classes.priceInteger}>{(product.list_price) ? formatPrice(product.list_price).units : ''}</span>
                    <sup className={classes.priceFraction}>{(product.list_price) ? `.${formatPrice(product.list_price).fractions}` : ''}</sup>
                  </div>
                )}
              </Fragment>
            )}
          />
        )}
        action={
          <IconButton aria-label="settings">
            <InfoIcon />
          </IconButton>
        }
      />
      <CardMedia
        style={{ margin: '1rem' }}
        className={classes.media}
        image={product.default_image_urls.large_image_url}
        title={product.name}
      />
      <CardHeader
        titleTypographyProps={{
          variant: 'span',
        }}
        title={product.name}
        subheader={(
          <Grid container justify="flex-start" alignItems="flex-start">
            <Grid item>
              <Rating
                className={classes.rating}
                name="simple-controlled"
                value={product.review_rating}
                size="small"
                // value={value}
                // onChange={(event, newValue) => {
                //   setValue(newValue);
                // }}
              />
            </Grid>
            <Grid item className={classes.reviewedBy}>
              <small>
                Reviewed by {product.review_count} people
              </small>
            </Grid>
          </Grid>
        )}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.full_name}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {product.can_add_to_wish_list === true && (
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        )}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        {/* <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton> */}
        {product.can_add_to_cart === true && (
        <Button
          aria-label="add to cart"
          variant="outlined"
          className={classes.addToCart}
          endIcon={<AddShoppingCartIcon />}
          onClick={(e) => {
            alert('adding product to cart')
            cart.addToCartClicked(e, product)
          }}
        >
          Add to Cart
        </Button>
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
            minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
            medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
            again without stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don’t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
