'use strict'
angular.module('main')
  .controller('maillistAddCtrl', function(debug, $window, $stateParams, $ionicHistory, PDD) {

    var alert = $window.alert
    var log = debug('app:domain:maillistList')
    var maillistList = this
    maillistList.domain = $stateParams.domain

    maillistList.goBack = function () {
      $ionicHistory.goBack()
    }

    maillistList.saveMailList = function() {

      var params = {
        domain: maillistList.domain,
        maillist: maillistList.name.toLowerCase()
      }

      PDD.ml.add(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {

            log('Added maillist domain: ' + params.domain + ' maillist: ' + params.maillist)

            maillistList.goBack()
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
  }
)
