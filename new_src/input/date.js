import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import DatePicker from 'react-bootstrap-date-picker'
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap'

const BStrapDateInput = ({
  attr, label, record, onChange, errors, showError = true, ...rest
}) => {
  //
  const errorText = errors ? errors.get(attr) : undefined

  return (
    <FormGroup validationState={errorText ? 'error' : 'success'}>
      <ControlLabel>{label}</ControlLabel>
      <DatePicker value={record.get(attr)} onChange={(value) => {
        onChange(attr, value)
      }} {...rest} />
      {showError && errorText ? <HelpBlock>{errorText}</HelpBlock> : null}
    </FormGroup>
  )
}

BStrapDateInput.propTypes = {
  attr: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object
}

export default observer(BStrapDateInput)
