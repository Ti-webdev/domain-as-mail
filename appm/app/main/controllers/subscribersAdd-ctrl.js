'use strict'
angular.module('main')
  .controller('subscribersAddCtrl', function(debug, $window, $stateParams, $ionicHistory, PDD) {

    var alert = $window.alert
    var log = debug('app:domain:subscribersAdd')
    var subscribers = this
    subscribers.domain = $stateParams.domain
    subscribers.mailList = $stateParams.maillist

    subscribers.goBack = function () {
      $ionicHistory.goBack()
    }

    subscribers.newSubscriber = {
      name: '',
      focus: false
    }


    subscribers.isNotCurrentMaillist = function (account) {
      if (subscribers.mailList) {
        return subscribers.mailList !== account.login
      }
      else {
        return true
      }
    }

    subscribers.isNotSubscribe = function (account) {
      if (subscribers.mailList) {
        return -1 === subscribers.subscribers.indexOf(account.login)
      }
      else {
        return true
      }
    }

    subscribers.refreshAccounts = function () {
      var log = debug('app:domain:accounts')
      return PDD.email.query(subscribers.domain)
        .then(function (result) {
          subscribers.accounts = result.accounts || []
          log('accounts loaded ' + subscribers.accounts.length)
        })
        .catch(function (err) {
          log('error code: ' + err.code)
          throw err
        })
    }

    subscribers.getSubscribers = function() {
      PDD.ml.listSubscribers(subscribers.domain, subscribers.mailList)
        .then(function (result) {
          subscribers.subscribers = result.subscribers
        })
    }

    subscribers.delSubscribers = function (name) {
      var params = {
        domain: subscribers.domain,
        maillist: subscribers.mailList,
        subscriber: name
      }
      PDD.ml.deleteSubscribers(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            var index = subscribers.subscribers.indexOf(name)
            if (-1 !== index) {
              subscribers.subscribers.splice(index, 1)
            }
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Ошибка ' + angular.toJson(err))
        })
    }

    subscribers.addSubscribers = function (subscriberName) {
      var params = {
        domain: subscribers.domain,
        maillist: subscribers.mailList,
        subscriber: subscriberName
      }
      PDD.ml.addSubscribers(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            subscribers.subscribers.push(params.subscriber)
            if (subscriberName === $subscribersScope.newSubscriber.name) {
              subscribers.newSubscriber.name = ''
              subscribers.newSubscriber.focus = true
            }
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Ошибка ' + angular.toJson(err))
        })
    }

    subscribers.getSubscribers()

    subscribers.refreshAccounts()
  }
)
