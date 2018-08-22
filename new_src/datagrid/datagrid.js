import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Checkbox, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import {buildTableHeaders} from 'react-mobx-admin/new_src/component_utils'

const BStrapHeader = ({children, sort, name, onSort}) => {
  //
  function _onUpClick (e) {
    onSort(name, sort === 'ASC' ? null : 'ASC')
    
    state && state.store && state.store.setEntityLastState &&
    state.store.setEntityLastState(state.store.cv.entityname, state.store.router.queryParams)
  }
  function _onDownClick (e) {
    onSort(name, sort === 'DESC' ? null : 'DESC')
    
    state && state.store && state.store.setEntityLastState &&
    state.store.setEntityLastState(state.store.cv.entityname, state.store.router.queryParams)
  }
  return (
    <div className='header'>
      <div className='capt'>{children}</div>
      {onSort ? (
        <div className='sort-buttons-box'>
          <Button bsSize='xsmall' bsStyle={sort === 'ASC' ? 'primary' : 'default'} onClick={_onUpClick}>
            <span className='glyphicon glyphicon-chevron-up' />
          </Button>
          <Button bsSize='xsmall' bsStyle={sort === 'DESC' ? 'primary' : 'default'} onClick={_onDownClick}>
            <span className='glyphicon glyphicon-chevron-down' />
          </Button>
        </div>
      ) : (<div className='sort-buttons-box'/>)}
    </div>
  )
}
BStrapHeader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  sort: PropTypes.string,
  name: PropTypes.string,
  onSort: PropTypes.func
}

const BStrapDatagrid = ({
  state, attrs, fieldCreator, headerCreator, rowId, isSelected, noSort,
  onRowSelection, onSort, sortstate, listActions, listActionLeft, allSelected,
  filters, TDComponent, TRComponent, TBodyComponent, refFn, options = {}
}) => {
  const _renderTD = ({...rest}) => TDComponent ? (
    <TDComponent {...rest} /> // custom
  ) : (
    <td {...rest} />  // or default
  )
  function _renderHeader (name, label, sort, onSort) {
    return (
      <th key={`th_${name}`}>
        <BStrapHeader
          sort={sort} name={name}
          onSort={noSort && noSort.some(n => n === name) ? null : onSort}>
          {headerCreator(name)}
        </BStrapHeader>
      </th>
    )
  }

  function _renderCell (attr, row, rowId) {
    const content = fieldCreator(attr, row)
    return _renderTD({key: `td_${rowId}_${attr}`, children: content})
  }

  function _onSelectAll (e) {
    e.target.checked ? onRowSelection('all') : onRowSelection([])
  }

  const selectable = onRowSelection !== undefined && isSelected !== undefined

  let tableChildren = state.loading ? (
    <tr><td>{
      options.loadingComponent ? options.loadingComponent() : (
        <div>
          <span className='glyphicon glyphicon-refresh glyphicon-refresh-animate' />
          &nbsp;Loading...
        </div>
      )
    }</td></tr>
  ) : state.items.length === 0 ? (
    <tr><td>{options.emptyComponent ? options.emptyComponent() : null}</td></tr>
  ) : state.items.map((row, rowIdx) => {
    const selected = selectable && isSelected(rowIdx)
    let cells = []
    selectable && cells.push(_renderTD({
      key: 'chbox',
      children: (
        <div ref={(node) => refFn && refFn(node, row)}>
          <Checkbox checked={selected} inline onChange={() => onRowSelection(rowIdx)} />
        </div>
      )
    }))
    listActionLeft && cells.push(_renderTD({key: 'lst-acts-l', children: listActionLeft(row)}))
    cells = cells.concat(attrs.map((attr, idx) => _renderCell(attr, row, idx)))
    listActions && cells.push(_renderTD({key: 'lst-acts', children: listActions(row)}))

    return TRComponent ? (
      <TRComponent selected={selected} key={rowIdx} row={row}>{cells}</TRComponent>
    ) : (
      <tr selected={selected} key={rowIdx}>{cells}</tr>
    )
  })

  return (
    <table className='table table-sm'>
      {headerCreator ? (
        <thead>
          <tr>
            {
              selectable ? (
                <th key='chbox'>
                  <Checkbox checked={allSelected} inline bsClass='btn'
                    onChange={_onSelectAll} />
                  <OverlayTrigger 
                      placement="right" 
                      overlay={<Tooltip>{
                          !sortstate._sortField
                            ? 'Resetuje filtry a řazení entity do defaultního stavu'
                            : 'Resetuje filtry a řazení entity do čistého stavu'
                      }</Tooltip>
                  }>
                    <Button bsStyle={'default'} bsSize={'small'} onClick={() => {
                      sortstate._sortField &&
                      sortstate._sortField.split(',') && 
                      sortstate._sortField.split(',').forEach(f => onSort(f, null))
                  
                      sortstate._sortField = ''
                      sortstate._sortDir = ''
                    }}>
                      <span className={'glyphicon glyphicon-ban-circle'}></span>
                    </Button></OverlayTrigger>
                </th>
              ) : null
            }
            {
              listActionLeft ? (
                <th key={'_actions-left'}>{ listActionLeft() }</th>
              ) : null
            }
            {
              buildTableHeaders(attrs, headerCreator, _renderHeader, onSort, sortstate, noSort)
            }
            {
              listActions ? (<th key={'_actions'}>{ listActions() }</th>) : null
            }
          </tr>
          {
            filters ? (
              <tr className='filter-row'>
                {
                  selectable ? <th key='s' /> : null
                }
                {
                  listActionLeft ? <th key='lid' /> : null
                }
                {
                  filters.map((i, idx) => <th key={idx}>{i}</th>)
                }
                {
                  listActions ? <th key='li' /> : null
                }
              </tr>
            ) : null
          }
        </thead>
      ) : null}
      {
        TBodyComponent
          ? <TBodyComponent>{tableChildren}</TBodyComponent>
          : <tbody>{tableChildren}</tbody>
      }
    </table>
  )
}
export default observer(BStrapDatagrid)
