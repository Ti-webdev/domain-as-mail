'use strict'
angular.module('main')
  .controller('aliasesCtrl', function(debug, $stateParams, $ionicHistory, PDD) {

    var aliases = this
    var log = debug('app:domain:aliases')
    aliases.domain = $stateParams.domain
    aliases.login = $stateParams.login

    if ($stateParams.aliases !== '') {
      aliases.aliases = JSON.parse($stateParams.aliases)
    }

    aliases.goBack = function () {
      $ionicHistory.goBack()
    }

    aliases.addAlias = function () {
      var params = {
        domain: aliases.domain,
        login: aliases.login,
        alias: aliases.name.toLowerCase()
      }
      PDD.email.addAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            log('Save aliase ' + params.alias)
            angular.extend(aliases.aliases, result.account.aliases)

            aliases.name = ''
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Ошибка ' + angular.toJson(err))
        })
    }

    aliases.delAlias = function (name) {
      var params = {
        domain: aliases.domain,
        login: aliases.login,
        alias: name
      }
      PDD.email.delAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            log('Delete aliase ' + params.alias)

            var index = aliases.aliases.indexOf(params.alias);
            aliases.aliases.splice(index, 1);
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Ошибка ' + angular.toJson(err))
        })
    }

  })
