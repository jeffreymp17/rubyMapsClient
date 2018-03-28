// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require_tree .
//= require jquery
var server='https://damp-inlet-25360.herokuapp.com';
$(document).on('turbolinks:load',function(){
$('.modal').modal();
hideFields();
last_search();
//load_select_distinct_names();
});

//funcion inicial que carga el mapa mediante un callback
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
   

    center: {lat: 10.1445678, lng: -85.45302950000001}
  });
  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });
}
function resetMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
   

    center: {lat: 10.1445678, lng: -85.45302950000001}
  });
}
 //metodo que busca por ciudad ,pais o iluegar transforma el texto en coordenadas para la busqueda
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
    
      showFields();
  $("#dataField").text("Informacion de la ubicacion").attr("class","black-text")
  $("#dataResults").val(results[0].formatted_address).attr("class","teal-text");
  $("#data").val(results[0].geometry.location.lat()).attr("class","teal-text");
  $("#dataLng").val(results[0].geometry.location.lng()).attr("class","teal-text");
  $("#labelAddress").attr("class","teal-text");
      saveSeachLocation();
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
          draggable: false,
        animation: google.maps.Animation.BOUNCE
        ,
        position: results[0].geometry.location
      });
    } else {
         clearText();
          $("#labelAddress").attr("class","teal-text");
      $("#labelAddress").attr("class","red-text");
      Materialize.toast("Ubicacion No encontrada :(","3000","rounded");
    }
  });
}

//boton click para buscar la actual ubicacion
$("#btnCurrentPosition").click(function(){

   currentGlobalPosition();
});
//limpiar campos
function clearText(){
  $("#dataField").text("");
       
}
function hideFields(){
$("#dataField").hide();
$("#dataResults").hide();
$("#dataLng").hide();
    $("#btnSave").hide();
$("#data").hide();
$("label").hide();

}
function showFields(){
$("#dataField").show();
  $("#data").show();
$("#dataResults").show();
$("#dataLng").show();
    $("#btnSave").show();
    $("label").show();

}
//este metodo obtiene la ubicacion actual de su maquina o telefono por estar viculada con la cuenta de google
function currentGlobalPosition() {
 clearText();
 var mapOptions = {
   zoom: 8,
    center: {lat: 9.9280694, lng: -84.09072459999999}
}
   var map = new google.maps.Map(document.getElementById('map'),mapOptions);
  var infoWindow = new google.maps.InfoWindow({map: map});

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Su posicion fue encontrada :)');
      map.setCenter(pos);
      console.log(pos);
      $("#dataField").text("Informacion de la ubicacion").attr("class","black-text")
  $("#dataResults").text("Informacion:"+pos.lat+"  "+pos.lng).attr("class","teal-text");
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // por si no soporta el navegador devuelve el error
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: El servicio de localizacion no esta disponible :(.' :
                        'Error: Su navegador\'No soporta la geolocalizacion :(.');
}
function saveSeachLocation(){
let long=	$("#data").val();
let lat=$("#dataLng").val();
let direction =$("#dataResults").val();
$.ajax({
      url: server+'/api/v1/locations',
      type: 'POST',
      data: {high:long,down:lat,address:direction},
       dataType: 'json',
      success: function (result) {
      console.log("insertado");
      },
      error: function (jqXHR, textStatus, error) {
        console.log(error);
      }
  });



}



function last_search(){
 $.ajax({
      url: server+'/api/locations',
      type: 'GET',
       dataType: 'json',
      success: function (resultJson){
          if (resultJson) {
            console.log(resultJson);
          //  $("#address").val(resultJson.data[0].address);
           
          }else{
       console.log("error");

          }
      },
      error: function (jqXHR, textStatus, error) {
        console.log(error);
      }
  });
}
function load_select_distinct_names(){
$.ajax({
type:"GET",
dataType: 'json',
url: server+'/api/v1/locations/name_distinct',
success:function(result){
$.each(result,function(index, jsonResult) {
   console.log(jsonResult);
   console.log(index);
  $("#names_select").append('<option value='+jsonResult.id+'>'+jsonResult.address+'</option>');
});        
},
error: function(result) {
alert('error');
}
});
}
