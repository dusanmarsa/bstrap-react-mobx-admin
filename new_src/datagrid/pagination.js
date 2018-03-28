import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {paginationRange} from 'react-mobx-admin'

const Pagination = observer(({store, onChange}) => {
  //
  const totalItems = store.totalItems
  const page = store.router.queryParams ? parseInt(store.router.queryParams._page) : 1
  const perPage = parseInt(store.router.queryParams._perPage) || 1
  const nbPages = Math.ceil(totalItems / perPage) || 1
  const offsetEnd = Math.min(page * perPage, totalItems)
  const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd)
  const displayPagination = perPage < totalItems

  const pageRange = paginationRange(page, perPage, totalItems)
    .map(pageNum => pageNum === '.' ? '' : (
      <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
        <a className='page-link' href='javascript:void(0)' onClick={() => onChange(pageNum)}>{pageNum}</a>
      </li>
    ))

  return (nbPages > 1) ? (
    <ul className='pagination'>
      {page > 1 &&
        <li key='prev' className='page-item'>
          <a className='page-link' href='javascript:void(0)' aria-label='Previous' onClick={() => onChange(page - 1)}>
            <span aria-hidden='true'>&laquo;</span>
            <span className='sr-only'>Previous</span>
          </a>
        </li>
      }
      {pageRange}
      {page !== nbPages &&
        <li key='next' className='page-item'>
          <a className='page-link' href='javascript:void(0)' aria-label='Previous' onClick={() => onChange(page + 1)}>
            <span aria-hidden='true'>&raquo;</span>
            <span className='sr-only'>Previous</span>
          </a>
        </li>
      }
    </ul>
  ) : null
})
Pagination.propTypes = {
  store: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

const PageInfo = observer(({info, query}) => {
  const totalItems = info.totalItems
  const page = query ? parseInt(query._page) : 1
  const perPage = parseInt(query._perPage) || 1
  const offsetEnd = Math.min(page * perPage, totalItems)
  const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd)

  return (<p className='pagination'>{offsetBegin}-{offsetEnd} of {totalItems}</p>)
})

export default { Pagination, PageInfo }
