import React from 'react'
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

import Datagrid from '../datagrid/datagrid'
import DatagridActions from 'react-mobx-admin/components/common/datagrid/actions'
import Filters from '../datagrid/filters'
import ListStore from 'react-mobx-admin/state/data_table'
import Pagination from '../datagrid/pagination'
import {
  Button,
  ButtonGroup,
  DropdownButton,
  MenuItem
} from 'react-bootstrap'

const BStrapListView = ({
  store, onAddClicked, onAddClickedFL, fields, filters, listActions, batchActions, renderOuter,
  perPageOptions, stableBatchActions, selectable = true
}) => {
  const nbPages = parseInt(store.totalItems)
  const perPageTitle = store.router.queryParams._perPage || ''
  const shiftDown = observable.box(false)
  filters = filters && filters.call ? filters() : filters
  perPageOptions = perPageOptions || store.perPageOptions || [5, 10, 15, 20, 50, 100, 1000]

  window.addEventListener('keydown', e => {
    if (e.keyCode === 16) {
      shiftDown.set(true)
      e.preventDefault()
      e.stopPropagation()
    }
  })

  function onSelectionChange (selection) {
    if (shiftDown.get() && store.selection && store.selection.length > 0) {
      if (store.selection.length > 0) {
        let first = store.selection[0]
        let newSelection = []

        if (selection < first) {
          for (let i = selection; i <= first; i++) {
            newSelection.push(i)
          }
        } else if (selection === first) {
          store.toggleIndex(selection)
        } else {
          for (let i = first; i <= selection; i++) {
            newSelection.push(i)
          }
        }
        store.updateSelection(newSelection)
        shiftDown.set(false)
        return
      }
    }

    if (selection === 'all') {
      store.selectAll()
    } else if (selection.length === 0) {
      store.updateSelection([])
    } else {
      // we have receive index of selected item
      // so toggle the selection of da index
      store.toggleIndex(selection)
    }
  }

  function isSelected (idx) {
    return store.selection.indexOf(idx) >= 0
  }

  const allSelected = store.selection.length > 0 && store.selection.length === store.items.length

  const filtersRender = (filters && store.state === 'ready') ? (
    <Filters.Controls state={store}
      hideFilter={store.hideFilter.bind(store)} filters={filters} />
  ) : null

  const perPageRender = (
    <DropdownButton className='per-page-select' title={perPageTitle} dropup
      id='dropdown' onSelect={(num) => store.setPerPage(num)}>
      {
        perPageOptions.map((i) => {
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
        {nbPages > 5 && perPageRender}
      </div>
      <div className='pull-left'>
        <div><Pagination.PageInfo info={store} query={store.router.queryParams} /></div>
      </div>
    </div>
  )

  const filterRow = filters ? Filters.FilterRow(filters, store) : null

  const result = (
    <div className='card'>
      <div className='card-block'>
        <div className='pull-right'>
          {(batchActions || stableBatchActions) &&
            <ButtonGroup style={{ verticalAlign: 'top ', marginRight: '0.3em' }} className='btn-group-top-right'>
              {batchActions && (<DatagridActions state={store} actions={batchActions} />)}
              {stableBatchActions && stableBatchActions()}
            </ButtonGroup>
          }
          { typeof store.store.dateFilterEnable !== 'undefined' &&
            store.store.dateFilterEnable(store.attrs) &&
            store.store.dateFilter
          }
          { typeof store.store.regionFilterEnable !== 'undefined' &&
            store.store.regionFilterEnable(store.attrs) &&
            store.store.regionFilter
          }
          <ButtonGroup style={{ verticalAlign: 'top ', marginRight: '0.3em' }} className='btn-group-top-right'>
            <Filters.Apply state={store} label={'apply filters'} apply={store.applyFilters.bind(store)} />
            {filters && (
              <Filters.Dropdown state={store} title='addfilter' filters={filters}
                showFilter={store.showFilter.bind(store)} />
            )}
          </ButtonGroup>
          {(onAddClicked || onAddClickedFL) &&
            <ButtonGroup style={{ verticalAlign: 'top', marginRight: '0.3em' }} className='btn-group-top-right'>
              {onAddClicked && <Button bsStyle='primary' onClick={() => onAddClicked(store)}>{store.addText || '+'}</Button>}
              {onAddClickedFL && <Button bsStyle='primary' onClick={() => onAddClickedFL(store)}>{store.addText || '+'} {'from last'}</Button>}
            </ButtonGroup>
          }
        </div>
        {store.title ? <h4 className='card-title'>{store.title}</h4> : null}
      </div>
      { filtersRender }
      <div className='card-block'>
        <Datagrid state={store} attrs={store.attrs}
          titles={store.headertitles} fields={fields}
          rowId={(row) => row[store.pkName]}
          listActions={listActions}
          onSort={store.updateSort.bind(store)} sortstate={store.router.queryParams}
          noSort={store.noSort}
          onRowSelection={selectable ? onSelectionChange : undefined}
          isSelected={isSelected}
          allSelected={allSelected}
          filters={filterRow} />
      </div>
      { pagination }
    </div>
  )

  return renderOuter ? renderOuter(result) : result
}

BStrapListView.propTypes = {
  batchActions: PropTypes.func,
  fields: PropTypes.arrayOf(PropTypes.func).isRequired,
  filters: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  listActions: PropTypes.func,
  onAddClicked: PropTypes.func,
  onAddClickedFL: PropTypes.func,
  perPageOptions: PropTypes.arrayOf(PropTypes.number),
  renderOuter: PropTypes.func,
  stableBatchActions: PropTypes.func,
  store: PropTypes.instanceOf(ListStore).isRequired
}
export default observer(BStrapListView)
