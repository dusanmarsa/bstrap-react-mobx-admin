import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import _ from 'underscore'
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap'
import {Typeahead, menuItemContainer, Menu} from 'react-bootstrap-typeahead'

@observer
export default class TypeAhead extends React.Component {
  state = {
    allowNew: false,
    isLoading: false,
    caseSensitive: false,
    ignoreDiacritics: true
  }

  render() {
    const {
      record, attr, label, errors, onSelected, options, disabled,
      labelKey, renderMenuItemChildren, multiple = false, ...rest
    } = this.props
    const errorText = errors.has(attr) ? errors.get(attr) : undefined
    const validationState = errorText ? 'error' : null
    const val = record.get(attr) || null
    const selectedVals = multiple ? (
      val ? val.toString().split(',') : []
    ) : (
      val !== null ? [val] : []
    )
    const selected = options.filter(i => selectedVals.indexOf(i.value) >= 0)

    return (
      <FormGroup validationState={validationState}>
        <ControlLabel>{label}</ControlLabel>
        <Typeahead
          {...this.state}
          {...rest}
          multiple={multiple}
          options={options}
          defaultSelected={selected}
          onSearch={this._handleSearch}
          onChange={this._handleChange}
        />
        {errorText ? <HelpBlock>{errorText}</HelpBlock> : null}
      </FormGroup>
    )
  }

  _handleChange = (val) => {
    const {attr, onChange, multiple} = this.props
    const l = val.map(i => {
      return i.value ? i.value : i
    })
    onChange(attr, l.join(','))
  }

  _handleSearch = (query) => {
    const {handleSearch} = this.props
    this.setState({isLoading: true})
    handleSearch(query).then(data => {
      this.setState({
        isLoading: false,
        options: data
      })
    })
  }
}
