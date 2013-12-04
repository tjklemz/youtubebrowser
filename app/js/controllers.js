'use strict';

/* Controllers */

var app = angular.module('app', ['phonecatFilters', 'ngAnimate']);

function makeYouTubeURL(userID, startIndex) {
  return "https://gdata.youtube.com/feeds/api/users/" + 
          userID + 
          "/uploads?alt=json&max-results=50&start-index=" + 
          startIndex;
}

function makeYouTubePreviewURL(video) {
  var id = video.id.$t.split('/').reverse()[0];
  return "http://img.youtube.com/vi/" + id + "/maxresdefault.jpg";
}

function parseVideos(videos) {
  for(var i = 0; i < videos.length; ++i) {
    var video = videos[i];
    video.previewImg = makeYouTubePreviewURL(video);
  }
  return videos;
}

$(document).ready(function() {
  $(window).scroll(function() {
    var scrollAmt = $(window).scrollTop();
    var height = $("#videos").height();
    
    if(scrollAmt >= 0.7*height) {
      var $scope = angular.element($('body')).scope();
      $scope.$apply(function() {
        $scope.next();
      });
    }
  });
});

app.controller('PhoneListCtrl', function($scope) {
  $scope.findVideos = function(start) {
    $scope.start = start ? start : 1;
    if (!start) { 
      $scope.videos = [];
      $scope.doneChunking = false;
    }

    if ($scope.userID) {
      $.ajax({
        'url': makeYouTubeURL($scope.userID, $scope.start),
        'dataType': "json",
        'success': function(data) {
          console.log('spam');
          if(data.feed.entry && data.feed.entry.length > 0) {
            var videos = parseVideos(data.feed.entry);
            $scope.$apply(function() {
              $scope.videos = $scope.videos.concat(videos);
            });
            $scope.start += $scope.videos.length;
          }
          if (data.feed.entry) {
            $scope.doneChunking = !data.feed.entry.length;
          }
        },
        'error': function() {
          $scope.videos = [];
        }
      });
    }

    $scope.next = function() {
      if(!$scope.doneChunking) {
        $scope.doneChunking = true;
        $scope.findVideos($scope.start);
      }
    }
  }
});
