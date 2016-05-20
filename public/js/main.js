(function() {
  'use strict';

  var socket = io();
  var markers = {};

  var feedbackOpen = 'notopen';
  var map = null;

  var mapClick = function(e) {
    bootbox.dialog({
      title: 'Lisää paikka',
      message: feedbackForm({ lat: e.latlng.lat, lng: e.latlng.lng, root: SERVER_ROOT }),
      buttons: {
        success: {
          label: 'Tallenna',
          className: 'btn-primary',
          callback: function() {
            var payload = {
              lat: $('input[name="lat"]').val(),
              lng: $('input[name="lng"]').val(),
              author: $('#feedbackNameInput').val(),
              text: $('#feedbackBodyInput').val()
            }
            socket.emit('addFeedback', payload);
          }
        }
      }
    });
  };

  var showMarkerModal = function(marker) {
    feedbackOpen = marker._id;
    var clickedMarker = markers[marker._id];
    bootbox.dialog({
      title: 'Paikka', //TODO: relevant content
      message: markerModal({ marker: clickedMarker, root: SERVER_ROOT }),
    });
  };

  var addMarker = function(marker) {
    markers[marker._id] = marker;
    var mapMarker = L.marker(marker.coordinates, { bounceOnAdd: true }).addTo(map);
    mapMarker._id = marker._id;
    mapMarker.on('click', function() { showMarkerModal(this) });
  };

  var updateMarker = function(marker) {
    markers[marker._id] = marker;
    if (feedbackOpen == marker._id) {
      var renderedComments = [];
      $('#commentContainer').find('.comment').each(function() {
        renderedComments.push($(this).data('commentid'));
      });
      for (var i = 0; i < marker.comments.length; i++) {
        if (renderedComments.indexOf(marker.comments[i]._id) < 0) {
          $('#commentContainer').append(singleComment({ comment: marker.comments[i] }));
        }
      }
    }
  };

  var getMarkers = function() {
    $.getJSON(SERVER_ROOT + '/feedback', function(feedback) {
      for (var i = 0; i < feedback.length; i++) {
        addMarker(feedback[i]);
      }
    });
  };

  $(document).ready(function() {

    map = L.map('map', { attributionControl: false }).setView([-32.39852, -59.23828], 3);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVsdmFpbiIsImEiOiJjaWV4dG9jZzMwMDd3c2ptMXBmbW5rMnByIn0.caixAd1WXzwe8qsd2KwYWg').addTo(map);

    L.control.sidebar('sidebar').addTo(map);

    map.on('click', mapClick);

    getMarkers();

    $(document).on('click', '#addCommentBtn', function(e) {
      var markerId = $(this).attr('data-marker-id');
      socket.emit('addComment', {
        id: markerId,
        text: $('#commentBody').val()
      });
    });

    socket.on('feedbackAdded', function(feedback) {
      addMarker(feedback);
    });

    socket.on('commentAdded', function(feedback) {
      updateMarker(feedback);
    });

    $('.infoBtn').popover('show');

    setTimeout(function() {
      $('.infoBtn').popover('hide');
    }, 5000);
  });
})();