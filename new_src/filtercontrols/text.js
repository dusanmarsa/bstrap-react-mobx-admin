import React from 'react'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'
import {Button, InputGroup, FormControl} from 'react-bootstrap'

const TextFilterControl = ({store, attr, isTableFilter = true}) => {
  //
  const isApplied = store.isFilterApplied(attr)
  const isChanged = store.isFilterValueChanged(attr)
  const onHide = () => {
    store.hideFilter(attr)
    isTableFilter && store.applyFilters()
  }
  const value = store.filters.get(attr) || ''

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
      <FormControl name={attr} value={value}
        onChange={(event) => {
          store.updateFilterValue(attr, event.target.value)
        }}
        onKeyPress={(e) => {
          if (e.charCode === 13) {
            e.preventDefault()
            store.applyFilters()
          }
        }}
      />
      {
        isTableFilter && isChanged ? (
          <InputGroup.Button>
            <Button onClick={() => store.applyFilters()}>
              <span className='glyphicon glyphicon-ok' />
            </Button>
          </InputGroup.Button>
        ) : null
      }
    </InputGroup>
  )
}

TextFilterControl.propTypes = {
  store: PropTypes.object.isRequired,
  attr: PropTypes.string.isRequired
}

export default observer(TextFilterControl)
