'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        //in case if it succeeds
        const {
            latitude
        } = position.coords;
        const {
            longitude
        } = position.coords;
        console.log(latitude, longitude)

        const coords = [latitude, longitude];

        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //Handling click on map
        map.on('click', function (mapE) { //we listen to click on map
            mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();

        })

    }, function () {
        alert('Could not get your position') //in case if it fails
    })
}

form.addEventListener('submit', function (e) {
    console.log(mapEvent)
    e.preventDefault();

    // Clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';


    // Display the marker
    const {
        lat,
        lng
    } = mapEvent.latlng; //we destructure latlng var from mapEvent
    L.marker([lat, lng]).addTo(map) //we show a marker at clicked latlng
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false, //this one keeps popup open when
            //other marker is selected
            closeOnClick: false,
            className: 'running-popup',
        })) //this is the message shown
        .setPopupContent('workout')
        .openPopup();
})

inputType.addEventListener('change', function () {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})
