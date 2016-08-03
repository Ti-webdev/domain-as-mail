'use strict'
angular.module('main')
  .controller('deputyAddCtrl', function($stateParams, $ionicHistory, PDD) {

    var deputyAdd = this

    deputyAdd.domain = $stateParams.domain

    deputyAdd.goBack = function () {
      $ionicHistory.goBack()
    }

    deputyAdd.addDeputy = function (login) {
      var params = {
        domain: deputyAdd.domain,
        login: login.toLowerCase()
      }

      PDD.deputy.add(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            deputyAdd.deputy = {
              login: ''
            }

            deputyAdd.goBack()
          }
          else if (result.error) {
            throw new Error(result.error)
          }
          else {
            throw new Error(angular.toJson(result))
          }
        }, function (err) {
          alert('Error ' + err.message)
        })
    }
  })
