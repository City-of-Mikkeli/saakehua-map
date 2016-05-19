(function() {
  'use strict';

  $(document).ready(function() {

    var markers = {};

    var feedbackOpen = "notopen";

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
                text: $('#feedbackBodyInput').val(),
              }
              $.post(SERVER_ROOT+'/feedback', payload, function(res){
                updateMarkers();
              });
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
            $('#commentContainer').append(singleComment({comment: marker.comments[i]}));
          }
        }
      }
    };

    var updateMarkers = function() {
      $.getJSON(SERVER_ROOT + "/feedback", function(feedback) {
        for (var i = 0; i < feedback.length; i++) {
          var marker = feedback[i];
          if (typeof (markers[marker._id]) === 'undefined') {
            addMarker(marker);
          } else {
            updateMarker(marker);
          }
        }
      });
    };

    var map = L.map('map', { attributionControl: false }).setView([-32.39852, -59.23828], 3);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVsdmFpbiIsImEiOiJjaWV4dG9jZzMwMDd3c2ptMXBmbW5rMnByIn0.caixAd1WXzwe8qsd2KwYWg').addTo(map);

    map.on('click', mapClick);
    
    updateMarkers();
    setInterval(function() { updateMarkers() }, 3000);
    
    $(document).on('click', '#addCommentBtn', function(e){
      var markerId = $(this).attr('data-marker-id');
      $.post(SERVER_ROOT+'/comment/'+markerId,{text: $('#commentBody').val()}, function(comment){
        updateMarkers(); 
      });
    });

    $('.infoBtn').popover('show');

    $('#commonModalDiv').on('hide.bs.modal', function(e) {
      feedbackOpen = "notopen";
    });

    setTimeout(function() {
      $('.infoBtn').popover('hide');
    }, 5000);
    
  });
})();