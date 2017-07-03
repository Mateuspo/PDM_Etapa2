/* rotas da PedidaApp */

angular.module('starter').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider

  .state('login',{
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  })

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeController'
  })

  .state('detalhe', {
    url: '/bolo/:boloId',
    templateUrl: 'templates/detalhe.html',
    controller: 'DetalheController'
  })

  .state('pedido', {
    url: '/pedido/:boloId',
    templateUrl: 'templates/pedido.html',
    controller: 'PedidoController'
  })

});
