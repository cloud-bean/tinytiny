'use strict';

app.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in help.controller.js
    $stateProvider

        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })

        // Each tab has its own nav history stack:

        .state('tab.search', {
            url: '/search',
            views: {
                'tab-search': {
                    templateUrl: 'templates/tab-search.html',
                    controller: 'searchBookCtrl'
                }
            }
        })

        .state('tab.detail', { 
            url: '/search/:bookId',
            views: {
                'tab-search': {
                    templateUrl: 'templates/tab-detail.html',
                    controller: 'showBookCtrl'
                }
            }
        })

        .state('tab.rent', {
            url: '/rent',
            views: {
                'tab-rent': {
                    templateUrl: 'templates/tab-rent.html',
                    controller: ''
                }
            }
        })

        .state('tab.return', {
            url: '/return',
            views: {
                'tab-return': {
                    templateUrl: 'templates/tab-return.html',
                    controller: ''  // 必须要在html页面中绑定controller，详细见 tab-return-book.html第4行，调试一下午才发现这个问题。
                }
            }
        })


        .state('tab.help', {
            url: '/help',
            views: {
                'tab-help': {
                    templateUrl: 'templates/tab-help.html',
                    controller: ''
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/search');


});
