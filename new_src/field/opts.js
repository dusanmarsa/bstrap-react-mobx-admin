import React from 'react'
import PropTypes from 'prop-types'

const OptionsField = ({val, attr, options, extractOpt = (i) => i, Component = null}) => {
  const found = options.find(i => {
    const opt = extractOpt(i)
    return opt.value.toString() === val
  })
  if (found) {
    const opt = extractOpt(found)
    return Component ? <Component text={opt.label} /> : <span>{opt.label}</span>
  }
  return null
}

OptionsField.propTypes = {
  attr: PropTypes.any.isRequired,
  val: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  options: PropTypes.array.isRequired,
  extractOpt: PropTypes.func,
  Component: PropTypes.func
}

export default OptionsField
