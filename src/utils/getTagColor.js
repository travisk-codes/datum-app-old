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