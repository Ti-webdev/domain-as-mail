'use strict';
angular.module('main')
.controller('DomainsCtrl', function ($log, $scope, $ionicModal, PDD) {
  var domains = this;

  domains.statusTitles = {
    'domain-activate': 'Не подтвержден',
    'mx-activate': 'Подтвержден, MX-запись не настроена',
    'added': 'Домен подтвержден'
  };

  domains.statusClasses = {
    'domain-activate': 'light',
    'mx-activate': 'royal',
    'added': 'stable'
  };

  domains.doRefresh = function () {
    return PDD.domain.query()
      .then(function (result) {
        domains.domains = result.domains || [];
        domains.error = null;
        domains.defaultLogo_Url = '../../main/assets/images/image@1x.png'
      })
      .catch(function (err) {
        domains.error = err;
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  }
  domains.doRefresh();


  var $addScope = $scope.$root.$new();
  var addModal = $ionicModal.fromTemplateUrl('main/templates/domainadd.html', {
    scope: $addScope,
    animation: 'slide-in-up'
  });
  $addScope.domain = {
    name: ''
  };
  domains.add = function () {
    $addScope.addDomain = function (name) {
      PDD.domain.register(name)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            domains.doRefresh();
            $addScope.modal.hide();
            $addScope.domain = {
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
    addModal.then(function (modal) {
      $addScope.modal = modal;
      modal.show();
    });
  };
});
