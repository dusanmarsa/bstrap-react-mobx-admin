import React from 'react'
import PropTypes from 'prop-types'
import Datagrid from '../datagrid/datagrid'
import Filters from '../datagrid/filters'
import Pagination from '../datagrid/pagination'
import { observer } from 'mobx-react'
import { DropdownButton, MenuItem, Button, ButtonGroup } from 'react-bootstrap'

const DatagridActions = observer(({actions, state}) => {
  return (state.selection.length > 0) ? actions(state) : null
})

const BStrapListView = ({
  store, onAddClicked, headerCreator, fieldCreator,
  filters, tableFilters, batchActions, options = {}, ...rest
}) => {
  //
  filters = filters && filters.call ? filters() : filters
  headerCreator = headerCreator || store.headerCreator.bind(store)
  const perPageTitle = store.router.queryParams._perPage || ''

  const onSelectionChange = batchActions ? (selection) => {
    if (selection === 'all') {
      store.selectAll()
    } else if (selection.length === 0) {
      store.updateSelection([])
    } else { // we have receive index of selected item
      // so toggle the selection of da index
      store.toggleIndex(selection)
    }
  } : undefined

  function isSelected (idx) {
    return store.selection.indexOf(idx) >= 0
  }

  const allSelected = store.selection.length > 0 &&
    store.selection.length === store.items.length

  const filtersRender = (filters && store.state === 'ready') ? (
    <Filters.Controls filters={filters} store={store} />
  ) : null

  const perPageRender = (
    <DropdownButton className='per-page-select' title={perPageTitle} dropup
      id='dropdown' onSelect={(num) => store.setPerPage(num)}>
      {
        store.perPageOptions.map((i) => {
          return <MenuItem eventKey={i} key={i}>{i}</MenuItem>
        })
      }
    </DropdownButton>
  )
  const pagination = (
    <div className='card-block'>
      <div className='pull-right'>
        <ButtonGroup>
          <Pagination.Pagination store={store} onChange={store.updatePage.bind(store)} />
        </ButtonGroup>
        {perPageRender}
      </div>
      <div className='pull-left'>
        <div><Pagination.PageInfo info={store} query={store.router.queryParams} /></div>
      </div>
    </div>
  )
  const filterRow = tableFilters ? Filters.FilterRow(tableFilters, store) : null
  const title = options.title ? options.title() : null
  const refFn = (node, row) => {
    if (row.id === store.scrollTo) {
      node && node.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
    }
  }

  return (
    <div className='card'>
      <div className='card-block'>
        <div className='pull-right'>
          <ButtonGroup>
            {
              batchActions ? (
                <DatagridActions state={store} actions={batchActions} />
              ) : null
            }
            {
              filters ? (
                <Filters.Dropdown store={store} filters={filters} />
              ) : null
            }
            {
              onAddClicked ? (
                <Button bsStyle='primary' onClick={() => onAddClicked(store)}>
                  {options.addText
                    ? options.addText()
                    : <span><em key={0} className='glyphicon glyphicon-plus-sign' />&nbsp; New</span>}
                </Button>
              ) : null
            }
          </ButtonGroup>
        </div>
        {title ? <h4 className='card-title'>{title}</h4> : null}
      </div>
      <div style={{clear: 'both'}}>
        { filtersRender }
      </div>
      <div className='card-block'>
        <Datagrid state={store} attrs={store.attrs} {...rest}
          headerCreator={headerCreator} fieldCreator={fieldCreator}
          rowId={(row) => row[store.pkName]}
          onSort={store.updateSort.bind(store)}
          sortstate={store.router.queryParams}
          noSort={store.noSort}
          onRowSelection={onSelectionChange} isSelected={isSelected}
          allSelected={allSelected} filters={filterRow}
          options={options} refFn={refFn} />
      </div>
      { pagination }
    </div>
  )
}

BStrapListView.propTypes = {
  store: PropTypes.object.isRequired,
  onAddClicked: PropTypes.func,
  headerCreator: PropTypes.func,
  fieldCreator: PropTypes.func.isRequired,
  filters: PropTypes.func,
  tableFilters: PropTypes.func,
  listActions: PropTypes.func,
  listActionLeft: PropTypes.func,
  batchActions: PropTypes.func,
  options: PropTypes.object
}
export default observer(BStrapListView)
