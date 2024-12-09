const fs = require('fs')

let date = new Date().getTime()
fs.writeFileSync('./AiSystem/version.txt',`${date}`)