// stdin.js - streaming example (nodeprogram.com Azat Mardan)

process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdin.on('data', function (chunk) {
 console.log('Odgovor: ', chunk)
})
process.stdin.on('end', function () {
 console.log('--- END ---')
})

