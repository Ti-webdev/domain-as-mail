'use strict';
angular.module('main')
.controller('DomainsCtrl', function ($log, $scope, $ionicModal, PDD, $ionicPopup) {
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


  domains.delete = function (name) {
    $ionicPopup.confirm({
      title: 'Удаление',
      template: 'Вы действительно хотите домен ' + name + '?',
      cancelText: 'Отмена',
      confirmText: 'ОК'
    }).then(function (res) {
      if (res) {
        PDD.domain.delete(name)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              domains.doRefresh()
            }
            else if (result.error) {
              throw  new Error(result.error)
            }
            else {
              throw new Error(angular.toJson(result))
            }
          }, function (err) {
            alert('Ошибка ' + err.message)
          })
      }
    })
  }

  domains.doRefresh = function () {
    return PDD.domain.query()
      .then(function (result) {
        domains.domains = result.domains || [];
        domains.error = null;
        domains.defaultLogo_Url = 'smain/assets/images/image@1x.png'
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

});
