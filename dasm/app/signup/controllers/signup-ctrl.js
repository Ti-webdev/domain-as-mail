'use strict';
angular.module('signup')
.controller('SignupCtrl', function ($window, $state, $localForage, apiKey) {
  var signup = this;
  signup.getApiKey = function () {
    var url = 'https://pddimp.yandex.ru/api2/registrar/get_token';
    $window.open(url, '_system', 'location=yes');
  };
  signup.submit = function () {
    $localForage.setItem('apiKey', this.apiKey)
      .then(function () {
        return $state.go('main.domains');
      })
  };
  signup.apiKey = apiKey;
});
