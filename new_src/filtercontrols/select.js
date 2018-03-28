import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import {Button, InputGroup} from 'react-bootstrap'
import SelectInput from '../input/select'

const SelectFilterControl = ({store, attr, isTableFilter = true, ...rest}) => {
  //
  const isApplied = store.isFilterApplied(attr)
  const onHide = () => {
    store.hideFilter(attr)
    isTableFilter && store.applyFilters()
  }
  const onChange = (attr, value) => {
    store.updateFilterValue(attr, value)
    if (value === null) store.hideFilter(attr)
    isTableFilter && store.applyFilters()
  }

  return (
    <InputGroup>
      {
        isApplied ? (
          <InputGroup.Button>
            <Button onClick={onHide}>
              <span className='glyphicon glyphicon-remove' />
            </Button>
          </InputGroup.Button>
        ) : null
      }
      <SelectInput record={store.filters} attr={attr} {...rest}
        onChange={onChange} />
    </InputGroup>
  )
}

SelectFilterControl.propTypes = {
  attr: PropTypes.string.isRequired
}

export default observer(SelectFilterControl)
