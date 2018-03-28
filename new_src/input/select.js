import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

const SelectInput = ({
  attr, label, record, options,
  extractOpt = (i) => i,
  errors, onChange,
  showError = true, allowEmpty = true, ...rest
}) => {
  //
  const errorText = errors ? errors.get(attr) : undefined
  const validationState = errorText ? 'error' : 'success'
  const v = record.get(attr)
  const value = v !== null && v !== undefined ? record.get(attr).toString() : ''

  function handleChange (evt) {
    if (evt.target.value.length === 0) {
      return onChange(attr, null)
    }
    const foundOpt = options.find(i => {
      const o = extractOpt(i)
      return o && o.value ? o.value.toString() === evt.target.value : false
    })
    onChange(attr, extractOpt(foundOpt).value)
  }

  const renderedOpts = options ? options.map((i, idx) => {
    const info = extractOpt(i)
    return <option key={idx} value={info.value}>{info.label}</option>
  }) : []
  allowEmpty && renderedOpts.unshift(<option key={'_null__'} value={''} />)

  return (
    <FormGroup controlId={attr} validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl componentClass='select' placeholder='select' {...rest}
        value={value} onChange={handleChange}>
        {renderedOpts}
      </FormControl>
      {showError && errorText ? <HelpBlock>{errorText}</HelpBlock> : null}
    </FormGroup>
  )
}

SelectInput.propTypes = {
  attr: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  extractOpt: PropTypes.func,
  allowEmpty: PropTypes.bool,
  label: PropTypes.string,
  errors: PropTypes.object
}

export default observer(SelectInput)
