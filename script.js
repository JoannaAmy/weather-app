let search = document.querySelector('.search');
let city = document.querySelector('.city-details');
let weatherImg = document.querySelector('.result-img');
let temperature = document.querySelector('.result-temp');
let temperatureDescription = document.querySelector('.result-temp-description');
let clouds = document.querySelector('.result-clouds');
let humidity = document.querySelector('.result-humidity');
let pressure = document.querySelector('.result-pressure');
let wind = document.querySelector('.result-wind');
let form = document.querySelector('form');
const errorMessage = document.querySelector('.error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    // alert('hello')

    if (search.value != '') {
        searchWeather()
    }
});

let apiKey = '32c4074a2cc208081f0bc2a1459ef8e8'
let url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;

const searchWeather = () => {
    fetch(url + '&q=' + search.value)
        .then(res => res.json())
        .then(data => {
            console.log(data);



            if (data.cod === 200) {
                document.querySelector('.result').classList.remove('hidden');

                sessionStorage.setItem('lastSearch', data.name);

                errorMessage.style.display = 'none';
                errorMessage.innerText = '';

                city.querySelector('p').innerHTML = data.name;
                city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                weatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                temperature.innerHTML = data.main.temp;
                temperatureDescription.innerHTML = data.weather[0].description;
                clouds.innerText = data.clouds.all;
                humidity.innerText = data.main.humidity;
                pressure.innerText = data.main.pressure;
                wind.innerText = data.wind.speed;


            }
            else {
                document.querySelector('.result').classList.add('hidden');

                errorMessage.innerHTML = 'City not found. Please Check Spelling';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.log('error', error);
        })

}

const searchDefault = () => {
    const savedCity = sessionStorage.getItem('lastSearch')
    search.value = savedCity || 'Lagos';
    searchWeather();
}

searchDefault();
