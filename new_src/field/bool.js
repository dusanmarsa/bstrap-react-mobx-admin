import React from 'react'
import PropTypes from 'prop-types'

const BStrapBoolField = ({val, attr, valuemapping}) => {
  val = valuemapping ? valuemapping[val] : val
  const checked = Boolean(val)
  return (
    <input className="form-check-input" name={attr} type="checkbox" checked={checked} disabled />
  )
}

BStrapBoolField.propTypes = {
  attr: PropTypes.string.isRequired,
  val: PropTypes.any
}

export default BStrapBoolField
