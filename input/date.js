import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import DatePicker from 'react-bootstrap-date-picker'
import { FormGroup, ControlLabel, HelpBlock, Checkbox } from 'react-bootstrap'

const BStrapDateInput = ({attr, label, record, onChange, onHeaderCheckedChange, errors, ...rest}) => {
  //
  function handleChange (value) {
    onChange(attr, value)
  }

  const errorText = errors ? errors.get(attr) : undefined

  return (
    <FormGroup validationState={errorText ? 'error' : 'success'}>
      <ControlLabel>
        {label}
        { onHeaderCheckedChange && Array.isArray(onHeaderCheckedChange) && 
          onHeaderCheckedChange[0] && onHeaderCheckedChange[1]
          ? <Checkbox 
              inline style={{ marginLeft: '5px' }} 
              onChange={e => onHeaderCheckedChange[1](attr, e.target.checked)}>
              {onHeaderCheckedChange[0]}
            </Checkbox>
          : null
        }
      </ControlLabel>
      <DatePicker value={record.get(attr)} onChange={handleChange} {...rest} />
      {errorText ? <HelpBlock>{errorText}</HelpBlock> : null}
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
