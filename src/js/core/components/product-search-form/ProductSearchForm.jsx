import React from 'react'
import deburr from 'lodash/deburr'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Popper from '@material-ui/core/Popper'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    height: 'auto',
    flexGrow: 1,
    width: '500px',
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
}))

function renderInputComponent(inputProps) {
  const {
    classes, inputRef = () => {
    }, ref, ...other
  } = inputProps

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  )
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  )
}

export default function IntegrationAutosuggest(props) {
  const classes = useStyles()

  const { label, items, itemProperty } = props

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [state, setState] = React.useState({
    single: '',
    popper: '',
  })

  const [stateSuggestions, setSuggestions] = React.useState([])

  const getSuggestions = (value) => {
    const inputValue = deburr(value.trim())
      .toLowerCase()
    const inputLength = inputValue.length
    let count = 0

    return inputLength === 0
      ? []
      : items.filter(suggestion => {
        const keep =
          count < 5 && suggestion[itemProperty].slice(0, inputLength)
            .toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
  }

  const getSuggestionValue = (suggestion) => {
    return suggestion[itemProperty]
  }

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }

  const handleSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const handleChange = name => (event, { newValue }) => {
    setState({
      ...state,
      [name]: newValue,
    })
  }

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  }

  return (
    <Grid className={classes.root} container spacing={2} alignItems="center" justify="flex-end">
      <Grid item>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            style: { width: '330px' },
            variant: 'outlined',
            margin: 'dense',
            fullWidth: true,
            id: 'react-autosuggest-popper',
            label,
            placeholder: '',
            value: state.popper,
            onChange: handleChange('popper'),
            inputRef: node => {
              setAnchorEl(node)
            },
            InputLabelProps: {
              shrink: true,
            },
            startAdornment: () => {
              return (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            },
          }}
          theme={{
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Popper anchorEl={anchorEl} open={Boolean(options.children)}>
              <Paper
                square
                {...options.containerProps}
                style={{ width: anchorEl ? anchorEl.clientWidth : undefined }}
              >
                {options.children}
              </Paper>
            </Popper>
          )}
        />
      </Grid>
      {/* <Grid item>
        <Button
          aria-label="search"
          variant="outlined"
          endIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Grid> */}
      <Grid item>
        <Button
          aria-label="clear search"
          variant="outlined"
          endIcon={<ClearIcon />}
        >
          Clear
        </Button>
      </Grid>
    </Grid>
  )
}
