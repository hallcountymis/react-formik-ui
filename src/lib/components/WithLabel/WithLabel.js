import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect, getIn } from 'formik'
import omit from 'lodash.omit'
import InfoMsg from '../InfoMsg'

export const WithLabel = (component = 'input') => WrappedComponent => {
  const Label = props => {
    const [hideLabel, setHide] = useState(false)

    const handleAutoFill = e => {
      setHide(e.animationName === 'onAutoFillStart')
    }

    const handleFocus = () => {
      setHide(true)
    }

    const handleBlur = () => {
      setHide(false)
    }

    const {
      formik: {
        touched,
        errors,
        values,
      },
      name,
      label,
      hint,
      placeholder,
      type,
      disabled,
      required,
      style,
      format,
    } = props

    const error = getIn(errors, name)
    const touch = getIn(touched, name)
    const value = getIn(values, name)
    const hide = hideLabel || !!value || !!placeholder || !!(disabled && value)
    const hidden = type && type === 'hidden'
    const errorMsg = touch && error ? error : null
    const moveLabel = component === 'phoneInput' && format === 'INTERNATIONAL'
    const passableProps = omit(props, ['hint', 'label', 'style'])

    return (
      <div className={cx('form-element', component, { hasError: !!errorMsg, hidden })} style={style}>
        <div
          className={cx(`${component}-wrapper`, { isDisabled: disabled })}
        >
          {
            label && (
              <span className={cx('label', { hide, moveLabel })}>
                {`${label}${required ? ' *' : ''}`}
              </span>
            )
          }
          <WrappedComponent
            onAnimationStart={handleAutoFill}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...passableProps}
          />
        </div>
        {!!errorMsg && (<InfoMsg errorMsg={errorMsg} />)}
        {!!hint && (<InfoMsg hintMsg={hint} />)}
      </div>
    )
  }

  Label.propTypes = {
    formik: PropTypes.instanceOf(Object).isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    hint: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    style: PropTypes.instanceOf(Object),
    format: PropTypes.string,
  }

  Label.defaultProps = {
    label: null,
    hint: null,
    placeholder: null,
    type: null,
    disabled: false,
    required: false,
    style: null,
    format: 'INTERNATIONAL',
  }

  return connect(Label)
}

export default WithLabel
