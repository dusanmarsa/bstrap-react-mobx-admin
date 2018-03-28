import React from 'react'
import {observer} from 'mobx-react'
import {DropdownButton, MenuItem} from 'react-bootstrap'

// dropdown with available filters
const Dropdown = observer(({store, filters}) => {
  const unusedFilters = filters.filter(i => !store.filters.has(i.attr))
  return unusedFilters.length ? (
    <DropdownButton title='filters' pullRight id='bg-nested-dropdown'>
      {
        unusedFilters.map((i, idx) => (
          <MenuItem key={idx} eventKey={idx} onClick={() => {
            store.showFilter(i.attr)
          }}>
            {i.title()}
          </MenuItem>
        ))
      }
    </DropdownButton>
  ) : null
})

// controls to set filter values
const Controls = observer(({filters, store}) => {
  return (
    <ul className='list-group row'>
      {
        filters.map((i, idx) => {
          const {Component, title, attr, ...rest} = i
          return store.filters.has(attr) ? (
            <li key={idx} className='list-group-item col-xs-4'>
              {title()}
              <Component record={store.filters} attr={attr}
                store={store} {...rest} />
            </li>
          ) : null
        })
      }
    </ul>
  )
})

const FilterRow = (filterCreator, store) => {
  return store.attrs.map(attr => {
    const filter = filterCreator(attr)
    if (!filter) return null
    const {typ, Component, ...rest} = filter
    const filtername = typ ? attr + typ : attr
    return (
      <Component store={store} attr={filtername} isTableFilter {...rest} />
    )
  })
}

export default { Dropdown, Controls, FilterRow }
