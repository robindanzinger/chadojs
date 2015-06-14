var chado = require('chado');
var fs = require('fs');

before( function () {
  console.log('before');
});

after( function () {
  chado.consoleReporter.logReport();
  fs.writeFileSync(
    "chado-result.json", 
    JSON.stringify(chado.repo, null, 2)
  );
});
