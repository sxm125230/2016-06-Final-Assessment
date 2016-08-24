angular.module('youtube.giffy', [])

.controller('GiffyController',['$scope','GiffyFactory',function ($scope, GiffyFactory) {
	$scope.giflist =[];
	$scope.elements = [];
	GiffyFactory.getAll('api/trending',{url:'http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC',limit:25})
	.then(function(obj) {
		console.log(obj.data.data)
		$scope.giflist=obj.data.data;
	});

	$scope.update=function (search) {
		GiffyFactory.getAll('api/search',{url:'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC',q:search})
	.then(function(obj) {
		console.log(obj.data.data)
		$scope.giflist=obj.data.data;
	});
	}
}])

.factory('GiffyFactory', function ($http) {
  // Your code here
  var data = {};
  var getAll = function (url,options) {
    return $http({
     method: 'GET',
     url: url,
     params: options
    })
    .then(function (resp) {
      return resp;
    });
  };

  return {
    getAll:getAll
  }
});