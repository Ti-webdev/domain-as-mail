'use strict'
angular.module('main')
  .controller('MailboxAddCtrl', function(debug, $stateParams, $ionicHistory, PDD) {

    var mailboxAdd = this
    var log = debug('app:domain:addMailbox')
    mailboxAdd.domain = $stateParams.domain

    mailboxAdd.goBack = function () {
      $ionicHistory.goBack()
    }

    mailboxAdd.addMailbox = function () {
      var params = {
        domain: mailboxAdd.domain,
        login: mailboxAdd.login.toLowerCase(),
        password: mailboxAdd.password.toLowerCase()
      }
      PDD.email.addMailbox(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {

            log('Saved ' + JSON.stringify(params))

            mailboxAdd.goBack()

            mailboxAdd.newAccount = {
              login: '',
              password: ''
            }
          }
          else if (result.error) {
            throw new Error(result.error)
          }
          else {
            throw new Error(angular.toJson(result))
          }
        }, function (err) {
          alert('Ошибка ' + err.message)
        })
    }
  })
