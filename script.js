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

class Workout {
    date = new Date();
    id = (new Date() + '').slice(-10);

    constructor(coords,distance,duration){
        this.coords = coords; //[lat,lng]
        this.distance = distance; //in km
        this.duration = duration; //in minutes
    }
}

class Running extends Workout {
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration)
        this.cadence = cadence;
        this.calcPace();
    }
    calcPace(){
        // min/km
        this.pace = this.duration/this.distance;
        return this.pace;
    }
}
class Cycling extends Workout {
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration)
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }
    calcSpeed(){
        //km/h
        this.speed = this.distance/(this.duration/60);
        return this.speed
    }
}


///////////////////////////////////////////////////////////////////
//APPLICATION
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
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));

        e.preventDefault();

        //get data from the form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;

        //if workout running, then create running object
        if(type==='running'){
            const cadence = +inputCadence.value
            //check if data is valid
            if(!validInputs(distance,duration,cadence)) return alert('Inputs have to be positive numbers!');
        }

        //if workout is cyclying, then create cycling object
        if(type==='cycling'){
            const Elevation = +inputElevation.value
             //check if data is valid
            if(!validInputs(distance,duration,cadence)) return alert('Inputs have to be positive numbers!');
        }

        //render workout map as marker

        //render new workout on list

        //hide the form and clear input fields
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
