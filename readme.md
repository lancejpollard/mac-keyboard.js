
# Mac Keyboard Generator

Instead of writing the [XML](https://gist.github.com/lancejpollard/b2377a181b5049654abe140cd843b84c) of the `.keylayout` file for macs, this will generate it for you.

TODO: specify all the features of the XML file.

```js
const fs = require('fs')
const keyboard = require('@lancejpollard/mac-keyboard.js')

const string = keyboard([
  {
    standard: keyboard.ANSI,
    control: true,
    bindings: [
      {
        sequence: [],
        result: 'e'
      }
    ]
  }
])

fs.writeFileSync('MyLang.keylayout', string)
```
