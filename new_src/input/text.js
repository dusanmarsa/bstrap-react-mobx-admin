import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

const TextInput = ({
  attr, record, label, onChange, errors, validationSuccess,
  showError = true, ...rest
}) => {
  //
  const errorText = errors ? errors.get(attr) : undefined
  const validationState = errorText ? 'error' : (validationSuccess ? 'success' : null)
  let value = record.get(attr) || ''

  return (
    <FormGroup controlId={attr} validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl name={attr} value={value} onChange={(event) => {
        onChange(attr, event.target.value)
      }} {...rest} />
      <FormControl.Feedback />
      {showError && errorText ? <HelpBlock>{errorText}</HelpBlock> : null}
    </FormGroup>
  )
}

TextInput.propTypes = {
  attr: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object
}

export default observer(TextInput)
