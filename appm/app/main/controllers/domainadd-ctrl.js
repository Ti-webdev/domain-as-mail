'use strict'
angular.module('main')
  .controller('DomainAddCtrl', function($stateParams, $ionicHistory, PDD) {

    var domainAdd = this

    domainAdd.goBack = function () {
      $ionicHistory.goBack()
    }

    domainAdd.domain = {
      name: ''
    };

    domainAdd.addDomain = function (name) {
      PDD.domain.register(name)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {

            domainAdd.goBack()

            domainAdd.domain = {
              name: ''
            };
          }
          else if (result.error) {
            throw new Error(result.error);
          }
          else {
            throw new Error(angular.toJson(result));
          }
        }, function (err) {
          alert('Error ' + err.message);
        });
    };
  })
