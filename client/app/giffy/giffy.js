angular.module('youtube.giffy', [])

.controller('GiffyController',['$scope','GiffyFactory',function ($scope, GiffyFactory) {
	$scope.data = {links:[]};
	$scope.elements = [];
	GiffyFactory.getAll({url:'http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC',limit:25})
	.then(function(obj) {
		$scope.data.links=obj.data;
	});
}])

.factory('GiffyFactory', function ($http) {
  // Your code here
  var data = {};
  var getAll = function (options) {
    console.log(options);
    return $http({
     method: 'GET',
     url: "api/giffy",
     params: options
    })
    .then(function (resp) {
      console.log(resp)
      return resp;
    });
  };

  return {
    getAll:getAll
  }
});