import React from 'react'
import { IconButton } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'

export const RotatingArrowButton = ({
  expanded,
  onClick = () => null,
  size = 'small',
  direction = 'cw'
}: {
  expanded: boolean
  onClick?: () => void
  size?: 'small' | 'medium'
  direction?: 'cw' | 'ccw'
}) => {
  return (
    <IconButton onClick={onClick} size={size}>
      <ArrowDropDown
        style={{
          transform: `rotate(${
            expanded ? 0 : direction === 'cw' ? -180 : 180
          }deg)`,
          transition: 'transform .5s'
        }}
      />
    </IconButton>
  )
}

export default RotatingArrowButton
