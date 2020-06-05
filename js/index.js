
var map;
var markers = [];
var infoWindow;

function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 8,
        styles: mapStyle,
        mapTypeControl: false, //Map or Satelite type of map is not allowed
    });
    infoWindow = new google.maps.InfoWindow();
    searchStore();
}
function  searchStore() {
    var findStores =[];
    var zipcode = document.getElementById('zipcode-input').value;    
    if(zipcode){
        stores.forEach(function(store, index){
            var postal = store.address.postalCode.substring(0, 5);
            if(postal==zipcode){
                findStores.push(store);
            }            
        })
    } else{
        findStores = stores;
    };
    clearLocation();
    displayStores(findStores);
    showStoresMarkers(findStores);
    displayStoreOnClick();
}
function displayStoreOnClick(){
    var storeItems = document.querySelectorAll('.store-container');
    storeItems.forEach(function(storeItem, index){
        storeItem.addEventListener('click', function () {
            google.maps.event.trigger(markers[index], 'click');
        })
    });
    var zipinput = document.getElementById("zipcode-input"); 
        zipinput.addEventListener("keyup", function(event) {
          if (event.keyCode === 13) {
           event.preventDefault();
           document.getElementById("search-btn").click();
          }
        }); 
    
}
function displayStores(stores) {
    var storesHtml = "";
    stores.forEach(function(store, index){
        var address = store.addressLines;
        var phone = store.phoneNumber;
        storesHtml += `
            <div class="store-container">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${index+1}
                    </div>
                </div>
            </div>
        `
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}
function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        var name = store.name;
        var address = store.addressLines[0];
        var addressLines =  store.addressLines;
        var phoneNumber = store.phoneNumber;
        var openStatus = store.openStatusText;
        bounds.extend(latlng);
        createMarker(latlng, name, address, phoneNumber, openStatus,addressLines, index+1);
    })
    map.fitBounds(bounds);
}
function clearLocation(){
    infoWindow.close();
         for (var i = 0; i < markers.length; i++) {
           markers[i].setMap(null); //clear marker
         }
         markers.length = 0;
}
function createMarker(latlng, name, address, phoneNumber, openStatus, addressLines, index) {
    var icon = {
        url: "images/starbucks coffee2.png",
        scaledSize: new google.maps.Size(80, 65),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
        
      };
  var html =`
  <div class="store-info-window">
    <div class="store-info-name">${name}</div>
    <div class="store-info-status">${openStatus}</div>
    <div class="store-info-address" >
    <i class="fas fa-location-arrow"></i>
    <a href="https://www.google.com/maps/dir/?api=1&origin&destination=${addressLines}" target="_blank" >${address}</a>
    </div>
    <div class="store-info-phone">
    <i class="fas fa-phone-alt"></i>
    ${phoneNumber}
    </div>
  </div>
    `;

    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: {
        text:index.toString(),
        color: "rgb(16, 42, 90)",
        fontSize: "13px",
        fontWeight: "700",
        origin: new google.maps.Point(0, 0)},
        icon: icon
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}