/*eslint-disable*/
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect, getIn } from 'formik'
import withLabel from '../withLabel'
import './styles.scss'

export class Autocomplete extends Component {
  static propTypes = {
    formik: PropTypes.instanceOf(Object).isRequired,
    suggestions: PropTypes.instanceOf(Array).isRequired,
    name: PropTypes.string.isRequired,
  }

  state = {
    activeSuggestion: 0,
    filteredSuggestions: null,
    showSuggestions: false,
  }

  onChange = e => {
    const { formik: { setFieldValue, setFieldTouched }, name, suggestions } = this.props
    const { value } = e.currentTarget

    const filteredSuggestions = suggestions.filter(
      suggestion => suggestion.toLowerCase().startsWith(value.toLowerCase()),
    )

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
    })

    setFieldValue(name, value)
    setFieldTouched(name, true)
  };

  onClick = e => {
    const { formik: { setFieldValue, setFieldTouched }, name } = this.props
    const { innerText } = e.currentTarget

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: null,
      showSuggestions: false,
    })

    setFieldValue(name, innerText)
    setFieldTouched(name, true)
  };

  onKeyDown = e => {
    const { formik: { setFieldValue, setFieldTouched }, name } = this.props
    const { activeSuggestion, filteredSuggestions } = this.state
    if (e.keyCode === 13) {
      e.preventDefault()

      setFieldValue(name, filteredSuggestions[activeSuggestion])
      setFieldTouched(name, true)

      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
      })

    } else if (e.keyCode === 38) {
      const { length } = filteredSuggestions

      this.setState(state => ({
        activeSuggestion: state.activeSuggestion === 0 ? (length - 1) : state.activeSuggestion - 1,
      }))

    } else if (e.keyCode === 40) {
      const { length } = filteredSuggestions

      this.setState(state => ({
        activeSuggestion: state.activeSuggestion === (length - 1) ? 0 : state.activeSuggestion + 1,
      }))
    }
  }

  render() {
    const {
      formik: {
        values
      },
      name,
      ...rest
    } = this.props
    const {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions,
    } = this.state
    const value = getIn(values, name)

    return (
      <Fragment>
        <input
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          {...rest}
          value={value}
          type="text"
          tabIndex="0"
        />
        {
          showSuggestions && !!value && (
            <ul className="suggestions">
              {
                filteredSuggestions ?.map((suggestion, index) => (
                  <li
                    className={cx({ 'suggestion-active': index === activeSuggestion })}
                    key={suggestion}
                    onClick={this.onClick}
                  >
                    {suggestion}
                  </li>
                ))
              }
            </ul>
          )
        }
      </Fragment>
    )
  }
}

export default connect(withLabel('input')(Autocomplete))

