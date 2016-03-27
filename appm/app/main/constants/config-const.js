'use strict'
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m#gulp-environment
  ENV: {
    /*inject-env*/
    'URL': 'https://domain-as-mail.ru/pddimp.yandex.ru/api2/admin/',
    'BASE_HREF': 'https://domain-as-mail.ru/'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m#gulp-build-vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

})
