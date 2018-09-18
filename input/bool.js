import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {Checkbox, FormGroup} from 'react-bootstrap'

const BStrapBoolInput = ({
  attr, label, record, onChange, onHeaderCheckedChange, valuemapping, errors, ...rest
}) => {
  //
  const checked = Boolean(record.get(attr))

  const handleChange = (event) => {
    const newVal = !checked
    onChange(attr, valuemapping ? valuemapping[newVal] : newVal)
  }

  return (
    <FormGroup>
      <Checkbox inline checked={checked} onChange={handleChange} {...rest}> {label} </Checkbox>
      { onHeaderCheckedChange && Array.isArray(onHeaderCheckedChange) && 
        onHeaderCheckedChange[0] && onHeaderCheckedChange[1]
        ? <Checkbox 
            inline style={{ marginLeft: '5px' }} 
            onChange={e => onHeaderCheckedChange[1](attr, e.target.checked)}>
            {onHeaderCheckedChange[0]}
          </Checkbox>
        : null
      }
    </FormGroup>
  )
}

BStrapBoolInput.propTypes = {
  attr: PropTypes.string.isRequired,
  errors: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired,
  valuemapping: PropTypes.object
}

export default observer(BStrapBoolInput)
