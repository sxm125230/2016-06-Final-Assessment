angular.module('youtube.songs', [])
.controller('YoutubeController',
  ['$scope', 'YoutubeFactory', function ($scope, YoutubeFactory) {
   $scope.data={};
   $scope.videos=[];
   $scope.playvideo={}
   $scope.playvideo.url='https://www.youtube.com/embed/4ZAEBxGipoA'
   var options = {
    part: 'snippet',
    key: 'AIzaSyC5cHH_gy4riYA0hYwRANNxfM-auQ5Lijs',
    q: 'autodesk',
    maxResults: 5,
    type: 'video',
    videoEmbeddable: 'true'
  }
  YoutubeFactory.search(options)
  .then(function(videos){
    console.log(videos)
    $scope.videos=videos
  });

  $scope.search=function(query){
    options.q=query;
    YoutubeFactory.search(options)
    .then(function(videos){
      console.log(videos)
      $scope.videos=videos
      $scope.playvideo=videos[0];
    });
  }
  $scope.play=function(video){
    $scope.playvideo.url="https://www.youtube.com/embed/"+video.id.videoId;
    console.log($scope.playvideo.url)
    $scope.playvideo.title=video.snippet.title;
    $scope.playvideo.description=video.snippet.description;
  }
}])
.factory('YoutubeFactory', function ($http) {
  // Your code here
  var data = {};
  var search = function (options) {
    console.log(search);
    return $http({
     method: 'GET',
     url: "https://www.googleapis.com/youtube/v3/search",
     params: options
    })
    .then(function (resp) {
      console.log(resp.data.items)
      return resp.data.items;
    });
  };

  return {
    search:search
  }
});



//  AIzaSyDxevVuj_joo5LpY46u9q6fbw16hIfnNeE
//"https://maps.googleapis.com/maps/api/geocode/json"
// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDxevVuj_joo5LpY46u9q6fbw16hIfnNeE
