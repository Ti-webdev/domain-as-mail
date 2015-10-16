'use strict';
angular.module('main')
.controller('DomainCtrl', function (PDD, $scope, $stateParams, $ionicModal, $ionicPopup, $window) {
  var domain = this;
  domain.shouldShowDelete = false;
  domain.name = $stateParams.domain;
  domain.doRefresh = function () {
    return PDD.email.query(domain.name)
      .then(function (result) {
        domain.accounts = result.accounts || [];
        // console.log(domain.domain);
        domain.error = null;
      })
      .catch(function (err) {
        console.log(err.code);
        domain.error = err;
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  var exampleAliases = [
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com',
    $window.faker.internet.userName().toLowerCase() + '@example.com'
  ]
  domain.accounts = [
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases },
    { login: $window.faker.internet.userName().toLowerCase() + '@example.com', fio: $window.faker.name.findName(), aliases: exampleAliases }
  ];
  // domain.doRefresh();

  var $aliasesScope = $scope.$root.$new();
  var aliasesModal = $ionicModal.fromTemplateUrl('main/templates/aliases.html', {
    scope: $aliasesScope,
    animation: 'slide-in-up'
  });
  $aliasesScope.newAlias = {
    name: ''
  };

  var $mailboxScope = $scope.$root.$new();
  var mailboxModal = $ionicModal.fromTemplateUrl('main/templates/mailbox.html', {
    scope: $mailboxScope,
    animation: 'slide-in-up'
  });
  $mailboxScope.newBox = {
    login: $window.faker.internet.userName().toLowerCase(),
    password: ''
  };

  domain.deleteMailbox = function (account) {
    var params = {
      domain: domain.name,
      uid: account.uid
    };
    $ionicPopup.confirm({
      title: 'Confirm delete',
      template: 'Are you sure you want to remove ' + account.login + ' mailbox?'
    }).then(function (res) {
      if (res) {
        PDD.email.removeMailbox(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              domain.doRefresh();
            }
            else {
              throw result;
            }
          }, function (err) {
            alert('Error ' + angular.toJson(err));
          });
      }
    });
  };

  domain.addMailbox = function () {
    $mailboxScope.domain = domain.name;
    $mailboxScope.addMailbox = function (login, password) {
      var params = {
        domain: domain.name,
        login: login.toLowerCase(),
        password: password.toLowerCase()
      };
      PDD.email.addMailbox(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            domain.doRefresh();
            $mailboxScope.modal.hide();
            $mailboxScope.newBox = {
              login: '',
              password: ''
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
    mailboxModal.then(function (modal) {
      $mailboxScope.modal = modal;
      modal.show();
    });
  };

  domain.showAliases = function (account) {
    $aliasesScope.account = account;
    $aliasesScope.addAlias = function (name) {
      var params = {
        domain: domain.name,
        login: account.login,
        alias: name.toLowerCase()
      };
      PDD.email.addAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            angular.extend(account, result.account);
            $aliasesScope.newAlias.name = '';
          }
          else {
            throw result;
          }
        }, function (err) {
          alert('Error ' + angular.toJson(err));
        });
    };
    $aliasesScope.delAlias = function (name) {
      var params = {
        domain: domain.name,
        login: account.login,
        alias: name
      };
      PDD.email.delAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            angular.extend(account, result.account);
          }
          else {
            throw result;
          }
        }, function (err) {
          alert('Error ' + angular.toJson(err));
        });
    };
    aliasesModal.then(function (modal) {
      $aliasesScope.modal = modal;
      modal.show();
    });
  };
});
