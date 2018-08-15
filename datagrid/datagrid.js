import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Checkbox, Button } from 'react-bootstrap'
import {
  buildHeaders, buildCells
} from 'react-mobx-admin/components/common/datagrid/table'
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

const BStrapHeader = ({label, sort, name, onSort, sortstate}) => {

  //
  function _onUpClick (e) {
    onSort(name, sort === 'ASC' ? null : 'ASC')
  }
  function _onDownClick (e) {
    onSort(name, sort === 'DESC' ? null : 'DESC')
  }

  return (
    <div>
      <div>{label}&nbsp;</div>
      {onSort && (
        <div className='sort-buttons-box'>
          <Button bsSize='xsmall' bsStyle={sort === 'ASC' ? 'primary' : 'default'} onClick={_onUpClick}>
            <span className='glyphicon glyphicon-chevron-up' />
          </Button>
          <Button bsSize='xsmall' bsStyle={sort === 'DESC' ? 'primary' : 'default'} onClick={_onDownClick}>
            <span className='glyphicon glyphicon-chevron-down' />
          </Button>
        </div>
      )}
    </div>
  )
}

BStrapHeader.propTypes = {
  label: PropTypes.string.isRequired,
  sort: PropTypes.string,
  name: PropTypes.string,
  onSort: PropTypes.func
}

const BStrapDatagrid = ({
  state, attrs, fields, titles, rowId, isSelected, noSort,
  onRowSelection, onSort, sortstate, listActions, listActionDelete, allSelected,
  filters, dragbleListEntity, customRowStyleClass, dragbleHelperClass
}) => {
  //
  function _renderHeader (name, label, sort, onSort) {
    return (
      <th key={`th_${name}`}>
        <BStrapHeader sortstate={sortstate}
          sort={sort} name={name} label={label}
          onSort={noSort && noSort.some(n => n === name) ? null : onSort} />
      </th>
    )
  }

  const listActionsRender = listActions ? (
    <th key={'_actions'}>{listActions()}</th>
  ) : null

  const listActionDeleteRender = listActionDelete ? (
    <th key={'_actions-delete'}>{listActionDelete()}</th>
  ) : null

  function _renderCell (row, name, creatorFn, rowId) {
    return (
      <td key={`td_${rowId}_${name}`}>
        {creatorFn(name, row)}
      </td>
    )
  }

  function _renderRowActions (row) {
    return listActions ? (
      <td key={'datagrid-actions'}>{listActions(row)}</td>
    ) : null
  }

  function _renderRowActionDelete (row) {
    return listActionDelete ? (
      <td key={'datagrid-actions-delete'}>{listActionDelete(row)}</td>
    ) : null
  }

  function _onSelectAll (e) {
    e.target.checked ? onRowSelection('all') : onRowSelection([])
  }

  const selectable = onRowSelection !== undefined && isSelected !== undefined
  const SortableItem = SortableElement(({row, children}) => <tr className={ customRowStyleClass ? customRowStyleClass(row) : 'noClass' } >{children}</tr> )
  const SortableWrapper = SortableContainer(({items, buildCells}) => {
    return (<tbody>
      {
        items.map((r, index) => (
          <SortableItem
            key={index}
            row={r}
            index={dragbleListEntity.editIndex ? dragbleListEntity.editIndex(index) : index}
            disabled={dragbleListEntity.disableFn(r)}>
            {buildCells(attrs, fields, r, rowId, _renderCell, _renderRowActions, _renderRowActionDelete)}
          </SortableItem>
        ))
      }
    </tbody>
    )
  })

  let tableChildren = state.loading
    ? <tr><td><span className='glyphicon glyphicon-refresh glyphicon-refresh-animate' /> Loading...</td></tr>
    : state.items.length === 0
      ? tableChildren = <tr><td>EMPTY</td></tr>
      : state.items.map((r, i) => {
        const selected = selectable && isSelected(i)
        return (
          <tr selected={selected} key={i} className={ customRowStyleClass ? customRowStyleClass(r) : 'noClass' }>
            {
              selectable ? (
                <td key='chbox'>
                  <Checkbox checked={selected} inline onChange={() => onRowSelection(i)} />
                </td>
              ) : null
            }
            {
              buildCells(attrs, fields, r, rowId, _renderCell, _renderRowActions, _renderRowActionDelete)
            }
          </tr>
        )
      })

  return (
    <table className='table table-sm'>
      {titles ? (
        <thead>
          <tr>
            { selectable ? <th>
              <div className='sort-buttons-box'>
                <Button bsStyle='default' bsSize='xsmall' onClick={() => {
                  sortstate._sortField &&
                  sortstate._sortField.split(',') && 
                  sortstate._sortField.split(',').forEach(f => onSort(f, null))
                  sortstate._sortField = ''
                  sortstate._sortDir = ''
                }}>
                  <span className='glyphicon glyphicon-refresh' />
                </Button>
              </div>
            </th> : null }
            {
              buildHeaders(attrs, titles, _renderHeader, listActionsRender,
                onSort, sortstate, noSort, listActionDeleteRender)
            }
          </tr>
          {
            filters ? (
              <tr className='filter-row'>
                {
                  selectable ? <th key='chbox'>
                    <Checkbox checked={allSelected} inline bsClass='btn' onChange={_onSelectAll} />
                  </th> : null
                }
                {
                  filters.map((i, idx) => <th key={idx}>{i}</th>)
                }
                {
                  listActions ? <th key='0' /> : null
                }
              </tr>
            ) : null
          }
        </thead>
      ) : null}
      {
        dragbleListEntity
          ? <SortableWrapper
            helperClass={dragbleHelperClass}
            items={state.items}
            buildCells={buildCells}
            onSortEnd={dragbleListEntity.onDragEnd}
            pressDelay={dragbleListEntity.dragToggleDelay} />
          : <tbody>{tableChildren}</tbody>
      }
    </table>
  )
}
export default observer(BStrapDatagrid)
