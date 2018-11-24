import React, { Fragment } from 'react'
import ChipInput from 'material-ui-chip-input'
import Tag from './Tag'

const DatumBar = props => {
  return (
    <ChipInput
      value={props.value}
      onAdd={props.onAddTag}
      onDelete={props.onDeleteTag}
      disableUnderline
      chipRenderer={(
        {
          isFocused,
          handleClick,
          value,
        }, 
        key
      ) => (
        <Fragment key={key}>
          <Tag
            onClick={handleClick}
            nameValueString={value}
            isActiveDatumTag
          />
          <div style={{display: 'inline-block', width: 6}} />
        </Fragment>
      )}
      style={props.style}
    />
  )
}

export default DatumBar