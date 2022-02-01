
const toKeyboardXML = require('.')

const string = toKeyboardXML({
  name: 'MyLang',
  keyboards: [
    {
      standard: toKeyboardXML.ANSI,
      configurations: [
        {
          control: true,
          bindings: [
            {
              sequence: ['e', 'f'],
              result: 'e'
            }
          ]
        }
      ]
    }
  ]
})

console.log(string)
