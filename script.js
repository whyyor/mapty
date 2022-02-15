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

class App {
    #map;
    #mapEvent;

    constructor() {
        this._getPostion();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
    }
    _getPostion() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your position') //in case if it fails
            })
        }
    }
    _loadMap(position) {
        //in case if it succeeds
        const {
            latitude
        } = position.coords;
        const {
            longitude
        } = position.coords;
        const coords = [latitude, longitude];

        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        //Handling click on map
        this.#map.on('click', this._showForm.bind(this))
    }
    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }
    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }
    _newWorkout(e) {
        e.preventDefault();

        // Clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        // Display the marker
        const {
            lat,
            lng
        } = this.#mapEvent.latlng; //we destructure latlng var from mapEvent
        L.marker([lat, lng]).addTo(this.#map) //we show a marker at clicked latlng
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
    }
}

const app = new App();
