'use strict'
angular.module('main', [])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/domains')
  $stateProvider
    .state('main', {
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      resolve: {
        apiKey: function ($localForage, $state) {
          return $localForage.getItem('apiKey')
            .then(function (apkKey) {
              if (apkKey) {
                return apkKey
              } else {
                return $state.go('signup')
              }
            })
        },
        PDD: function (apiKey, getPDDForKey) {
          return getPDDForKey(apiKey)
        }
      }
    })
    .state('main.domains', {
      url: '/domains',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/domains.html',
          controller: 'DomainsCtrl as domains'
        }
      }
    })
    .state('main.adddomain', {
      url: '/domains/adddomain',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/domainadd.html',
          controller: 'DomainAddCtrl as ctrl'
        }
      }
    })
    .state('main.domain', {
      url: '/domain/:domain',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/domain.html',
          controller: 'DomainCtrl as domain'
        }
      },
      resolve: {
        isOwner: function (PDD, $stateParams) {
          return PDD.deputy.list($stateParams.domain).then(function (result) {
            return !('not_master_admin' === result.error)
          })
        }
      }

    })
    .state('main.mailbox', {
      url: '/domain/:domain/isOwner/:isOwner/mailbox/:login',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/mailbox.html',
          controller: 'MailboxCtrl as mailbox'
        }
      }
    })
    .state('main.mailboxAdd', {
      url: '/domain/:domain/isOwner/:isOwner/mailboxAdd/',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/mailbox_add.html',
          controller: 'MailboxAddCtrl as ctrl'
        }
      }
    })
    .state('main.aliases', {
      url: '/domain/:domain/mailbox/:login/aliases/:aliases',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/aliases.html',
          controller: 'aliasesCtrl as ctrl'
        }
      }
    })
    .state('main.mailboxList', {
      url: '/domain/:domain/owner/:owner/mailbox',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/mailboxList.html',
          controller: 'MailboxCtrlList as mailboxList'
        }
      }
    })
    .state('main.dnsList', {
      url: '/domain/:domain/dns',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/dnslist.html',
          controller: 'dnsCtrlList as dnsList'
        }
      }
    })
    .state('main.dnsRecordAdd', {
      url: '/domain/:domain/dns/:dns',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/dnsrecord_add.html',
          controller: 'dnsRecordAddCtrl as ctrl'
        }
      }
    })
    .state('main.maillistList', {
      url: '/domain/:domain/maillist',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/maillist_list.html',
          controller: 'maillistCtrlList as maillistList'
        }
      }
    })
    .state('main.maillistSubscribers', {
      url: '/domain/:domain/maillist/maillist/:maillist',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/subscribers.html',
          controller: 'subscribersAddCtrl as ctrl'
        }
      }
    })
    .state('main.maillistListAdd', {
      url: '/domain/:domain/maillist/add',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/maillist_add.html',
          controller: 'maillistAddCtrl as ctrl'
        }
      }
    })
    .state('main.deputies', {
      url: '/domain/:domain/deputies',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/deputylist.html',
          controller: 'deputyCtrlList as deputyList'
        }
      }
    })
    .state('main.deputy', {
      url: '/domain/:domain/deputies/addDeputy',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/deputy_add.html',
          controller: 'deputyAddCtrl as ctrl'
        }
      }
    })
})
