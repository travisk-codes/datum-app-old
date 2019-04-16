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


const letterColors = {
  'a': 'red',
  'b': 'blue',
  'c': 'orange',
  'd': 'darkblue',
  'e': 'orange',
  'f': null,
  'g': 'saddlebrown',
  'h': 'maroon',
  'i': null,
  'j': 'saddlebrown',
  'k': 'indigo',
  'l': null,
  'm': 'mediumvioletred',
  'n': 'darkmagenta',
  'o': null,
  'p': 'hotpink',
  'q': null,
  'r': 'yellow',
  's': 'yellow',
  't': 'limegreen',
  'u': null,
  'v': 'indigo',
  'w': null,
  'x': null,
  'y': 'yellow',
  'z': null,
}

export default (name) => {
  return letterColors[name[0]]
}

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
  50,
  100,
  200,
  300,
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
  return colors[Math.floor( Math.random() * colors.length )]
}
