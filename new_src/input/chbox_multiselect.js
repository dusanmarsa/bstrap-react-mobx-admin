import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import _ from 'underscore'
import {FormGroup, ControlLabel, HelpBlock, Checkbox} from 'react-bootstrap'

const ChBoxSelect = ({
  attr, record, onChange, errors, label, disabled, options
}) => {
  const val = record.get(attr) ? record.get(attr).toString().split(',') : []
  const checked = (att) => {
    return _.indexOf(val, att) >= 0
  }
  const errorText = errors && errors.has(attr) ? errors.get(attr) : undefined
  const validationState = errorText ? 'error' : null

  const chBoxes = options.map((i, idx) => {
    const onClick = (evt) => {
      const newval = evt.target.checked
        ? _.union(val, [i.value])
        : _.without(val, i.value)
      onChange(attr, newval.length > 0 ? newval.join(',') : null)
    }
    return (
      <Checkbox key={idx} checked={checked(i.value)}
        disabled={disabled}
        onChange={onClick} inline>
        {i.label ? i.label : i.text}
      </Checkbox>
    )
  })
  return (
    <FormGroup validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <div>{chBoxes}</div>
      {errorText ? <HelpBlock>{errorText}</HelpBlock> : null}
    </FormGroup>
  )
}
ChBoxSelect.propTypes = {
  attr: PropTypes.string.isRequired,
  errors: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired
}
export default observer(ChBoxSelect)
