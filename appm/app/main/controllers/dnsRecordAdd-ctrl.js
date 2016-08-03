'use strict'
angular.module('main')
  .controller('dnsRecordAddCtrl', function(debug, $stateParams, $window) {

    var log = debug('app:domain:dnsList')
    var alert = $window.alert
    var addRecord = this
    addRecord.domain = $stateParams.domain
    addRecord.newDNS = JSON.parse($stateParams.dns)

    addRecord.isEdit = false

    addRecord.goBack = function () {
      $ionicHistory.goBack()
    }

    addRecord.processDNSRecord = function (dns) {

      addRecord.isEdit = (typeof(dns) !== 'undefined')

      if (addRecord.isEdit) {
        addRecord.newDNS = dns
      }
      else {
        addRecord.clearNewDns()
      }

      addRecord.refreshDNSRecordFieldList()

      addRecord.processDNSRecord = function (newDNS) {
        var params = {
          domain:     dnsList.domain,
          record_id:  newDNS.record_id,
          type:       newDNS.type,
          admin_mail: newDNS.admin_mail,
          content:    newDNS.content,
          priority:   newDNS.priority,
          weigth:     newDNS.weigth,
          port:       newDNS.port,
          target:     newDNS.target,
          subdomain:  newDNS.subdomain,
          ttl:        newDNS.ttl
        }

        return (addRecord.isEdit ? PDD.dns.edit(params) : PDD.dns.add(params))
          .then(function (result) {
            if (result.success && 'ok' === result.success) {

              addRecord.goBack()
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
    }

    addRecord.clearNewDns = function() {
      addRecord.newDNS = {
        type: 'A',
        admin_mail: '',
        content: '',
        priority: '10',
        weigth: '',
        port: '',
        target: '',
        subdomain: '@',
        ttl: '21600',
        refresh: '',
        retry: '',
        expire: '',
        neg_cache: ''
      }
    }

    addRecord.recordTypeCollection = ['SRV', 'TXT', 'NS', 'MX', 'SOA', 'A', 'AAAA', 'CNAME']

    addRecord.refreshDNSRecordFieldList = function() {
      var
        type = addRecord.newDNS.type

      addRecord.fields = {
        subdomain: 'Имя поддомена',
        content: 'Содержимое DNS записи',
        ttl: 'Время жизни DNS-записи в секундах'
      }

      switch (type) {
        case 'SOA':
          addRecord.fields.admin_mail = 'Email-адрес администратора'

          addRecord.fields.refresh = 'Частота проверки в секундах вторичными DNS-серверами DNS-записи для этой зоны'
          addRecord.newDNS.refresh = ''

          addRecord.fields.retry = 'Время в секундах между повторными попытками вторичных DNS-серверов получить записи зоны'
          addRecord.newDNS.retry = ''

          addRecord.fields.expire = 'Время в секундах, по истечении которого вторичные DNS-серверы считают записи зоны несуществующими, если основной сервер не отвечает'
          addRecord.newDNS.expire = ''

          addRecord.fields.neg_cache = 'Время в секундах, в течение которого будет кешироваться отрицательный ответ (ERROR = NXDOMAIN) от DNS-сервера'
          addRecord.newDNS.neg_cache = ''

          break
        case 'SRV':
          addRecord.fields.weigth = 'Вес SRV-записи относительно других SRV-записей'
          addRecord.fields.priority = 'Приоритет DNS записи'
          addRecord.fields.port = 'TCP или UDP-порт хоста'
          addRecord.fields.target = 'Каноническое имя хоста'
          break
        case 'MX':
          addRecord.fields.priority = 'Приоритет DNS записи'
          break
      }
    }

    addRecord.processDNSRecord(addRecord.newDNS)
  })
