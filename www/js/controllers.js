/* controllers da PedidaApp */
/* PS. Em uma App complexa, crie arquivos separados para cada controller */

angular.module('starter').controller('HomeController', function ($scope, ProdutosService) {
	ProdutosService.lista().then(function (dados) {
		$scope.bolos = dados;
	});

	$scope.$on('produtos-atualizados', function (event, dados) {
		$scope.bolos = dados;
	})
});


angular.module('starter').controller('DetalheController', function ($scope, ProdutosService, $stateParams) {
	ProdutosService.lista().then(function (dados) {
		$scope.bolo = dados[$stateParams.boloId];
	});

	$scope.$on('produtos-atualizados', function (event, dados) {
		$scope.bolos = dados;
	})
});

angular.module('starter').controller('LoginController', function ($state, $scope,  $ionicPopup, $ionicLoading) {
	$scope.dados = {};

	$scope.logar = function () {
		if (($scope.dados.login != null && $scope.dados.login != '') &&
			($scope.dados.senha != null && $scope.dados.senha != '')) {

			var login = localStorage.getItem($scope.dados.login);
			if (login != null) {
				if (login == $scope.dados.senha) {
					navigator.vibrate(500);
					$ionicPopup.alert({
						title: 'Bem vindo!',
						template: "Redirecionando para o menu."
					}).then(function () {
						$state.go('home');
					});

				} else {
					navigator.vibrate([500, 500]);
					$ionicPopup.alert({
						title: 'Senha incorreta!',
						template: "Prencha sua senha novamente."
					});
				}
			} else {
				navigator.vibrate([500, 500]);
				$ionicPopup.alert({
					title: 'Usuário Inexistente!',
					template: "Gerado novo usuário."
				}).then(function () {
					localStorage.setItem($scope.dados.login, $scope.dados.senha);
				});
			}
		} else {
			navigator.vibrate([500, 500]);
			$ionicPopup.alert({
				title: 'Dados em branco!',
				template: "Prencha seu login e senha."
			});
		}
	}
});


angular.module('starter').controller('PedidoController', function ($scope, $stateParams, $http, $state, $ionicPopup, $ionicLoading, $cordovaGeolocation, ProdutosService) {

	ProdutosService.lista().then(function (dados) {
		$scope.bolo = dados[$stateParams.boloId];
	});

	$scope.dados = {};

	$scope.encontrarLocal = function () {
		$ionicLoading.show();

		var lat;
		var long;

		console.log('Teste Entrou na função!');

		$cordovaGeolocation
			.getCurrentPosition({
				timeout: 5000,
				enableHighAccuracy: true
			})
			.then(function (position) {
				var lat = position.coords.latitude;
				var long = position.coords.longitude;

				console.log('Entrou na função geolocation!');
				var url = 'http://maps.google.com/maps/api/geocode/json?latlng=' + lat + ',' + long;

				// sempre dispara o serviço pra checar dados mais recentes
				var promise = $http.get(url).then(function (response) {

					var json = JSON.stringify(response.data);
					//console.log('>>> '+json);
					console.log('>>> ' + response.data.results[0].formatted_address);

					$scope.dados.endereco = response.data.results[0].formatted_address;
				});
			}).catch(function (err) {
				console.log('Erro? ' + err);

				$ionicPopup.alert({
					title: 'Erro!',
					template: 'Não foi possivel buscar o endereço, insira manualmente.'
				});
				//TODO Display error message
			}).finally(function () {
				// em qualquer caso, remove o spinner de loading
				$ionicLoading.hide();
			});

	};

	$scope.fecharPedido = function () {

		// mostra o spinner de loading
		$ionicLoading.show();

		if (($scope.dados.telefone != null && $scope.dados.telefone != '') &&
			($scope.dados.endereco != null && $scope.dados.endereco != '') &&
			($scope.dados.nome != null && $scope.dados.nome != '')) {
			// dispara a API
			$http.get('http://cozinhapp.sergiolopes.org/novo-pedido', {
				params: {
					pedido: $scope.bolo.nome,
					info: $scope.dados.nome
					+ ' (' + $scope.dados.telefone + ') - '
					+ $scope.dados.endereco
				}
			}).then(function () {

				// caso OK, mostra popup confirmando e
				// então navega pra home

				navigator.vibrate(500);

				$ionicPopup.alert({
					title: 'Pedido confirmado!',
					template: 'Daqui a pouco chega :)'
				}).then(function () {
					$state.go('home');
				});

			}).catch(function (erro) {
				navigator.vibrate([500, 500]);
				// caso dê erro mostra alerta com o erro
				$ionicPopup.alert({
					title: 'Erro no pedido!',
					template: erro.data + '. Liga pra gente: 011-1406'
				});

			}).finally(function () {
				// em qualquer caso, remove o spinner de loading
				$ionicLoading.hide();
			});

		} else {
			var msg = 'Informe seu '
			if ($scope.dados.nome == null || $scope.dados.nome == '') {
				msg += "Nome"
			}
			if ($scope.dados.telefone == null || $scope.dados.telefone == '') {
				if (msg.length > 12) {
					msg += ", "
				}
				msg += "Telefone"
			}
			if ($scope.dados.endereco == null || $scope.dados.endereco == '') {
				if (msg.length > 12) {
					msg += ", "
				}
				msg += "Endereço"
			}

			navigator.vibrate([500, 500]);
			$ionicPopup.alert({
				title: 'Dados em branco!',
				template: "Prencha os seguintes campos: " + msg + "."
			});

			$ionicLoading.hide();
		}
	};
});