import red from '@material-ui/core/colors/red'
import pink from '@material-ui/core/colors/pink'
import purple from '@material-ui/core/colors/purple'
import deepPurple from '@material-ui/core/colors/deepPurple'
import indigo from '@material-ui/core/colors/indigo'
import blue from '@material-ui/core/colors/blue'
import lightBlue from '@material-ui/core/colors/lightBlue'
import cyan from '@material-ui/core/colors/cyan'
import teal from '@material-ui/core/colors/teal'
import green from '@material-ui/core/colors/green'
import lightGreen from '@material-ui/core/colors/lightGreen'
import lime from '@material-ui/core/colors/lime'
import yellow from '@material-ui/core/colors/yellow'
import amber from '@material-ui/core/colors/amber'
import orange from '@material-ui/core/colors/orange'
import deepOrange from '@material-ui/core/colors/deepOrange'

export const colors = [
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
]

export const color_numbers = [
  //50,
  //100,
  //200,
  //300,
  400,
  500,
  600,
  700,
  800,
  900,
  'A100',
  'A200',
  'A400',
  'A700',
]

export function rand_color() {
  const shade = color_numbers
  [Math.floor(Math.random() * color_numbers.length)]
  return colors
  [Math.floor(Math.random() * colors.length)]
  [shade]
}

/*
export function get_tag_names()

export function get_tag_colors()

export function get_values(tag_name)
*/

export function objectify(tag) {
  if (typeof tag !== 'string') {
    if (tag.name) return tag
    console.error('tag not of format name:value or { name, value }')
    return null
  }
  const split = tag.indexOf(':')
  if (split < 0) return { name: tag, value: '' }
  const name = tag.substring(0, split)
  const value = tag.substring(split + 1)
  return { name, value }
}

export function stringify(tag) {
  if (typeof tag === 'string') {
    return tag
  } else if (typeof tag === 'object') {
    return `${tag.name}:${tag.value}`
  } else {
    console.error('stringify takes string or object, not ' + typeof tag)
  }
}