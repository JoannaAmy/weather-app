let search = document.querySelector(".search");
let city = document.querySelector(".city-details");
let weatherImg = document.querySelector(".result-img");
let temperature = document.querySelector(".result-temp");
let temperatureDescription = document.querySelector(".result-temp-description");
let clouds = document.querySelector(".result-clouds");
let humidity = document.querySelector(".result-humidity");
let pressure = document.querySelector(".result-pressure");
let wind = document.querySelector(".result-wind");
let form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
let loading = document.querySelector(".loading-message");
let apiKey = "32c4074a2cc208081f0bc2a1459ef8e8";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (search.value != "") {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=${apiKey}`;
    searchWeather(url);
  }
});

function showLoading() {
  loading.style.display = "block";
  document.querySelector(".result").classList.add("hidden");
}

function hideLoading() {
  loading.style.display = "none";
  document.querySelector(".result").classList.remove("hidden");
}

async function searchWeather(url) {
  showLoading();

  // errorMessage.style.display = "none";
  // errorMessage.innerText = "";

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);

    // await new Promise((resolve) => setTimeout(resolve, 300));
    if (data.cod === 404) {
      errorMessage.style.display = "block";
      return;
    }

    if (data.cod === 200) {
      document.querySelector(".result").style.display = "block";

      sessionStorage.setItem("lastSearch", data.name);
      errorMessage.style.display = "none";

      city.querySelector("p").innerHTML = data.name;
      city.querySelector(
        "img"
      ).src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
      weatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
      temperature.innerHTML = data.main.temp;
      temperatureDescription.innerHTML = data.weather[0].description;
      clouds.innerText = data.clouds.all;
      humidity.innerText = data.main.humidity;
      pressure.innerText = data.main.pressure;
      wind.innerText = data.wind.speed;
    } else {
      document.querySelector(".result").style.display = "none";
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    hideLoading();
  }
}
function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const debouncedSearch = debounce((searchValue) => {
  searchWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=metric&appid=${apiKey}`
  );
}, 1000);

search.addEventListener("input", (event) => {
  const searchValue = event.target.value;
  if (searchValue !== "") {
    errorMessage.style.display = "none";
    
    debouncedSearch(searchValue);
  }
});

// function saveInput() {
//   if (search.value !== "") {
//     // let url = ;
//     searchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=${apiKey}`);
//   }
// }
// const processInput = debounce(searchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=${apiKey}`), 500);

const searchDefault = () => {
  const savedCity = sessionStorage.getItem("lastSearch");

  if (savedCity) {
    search.value = savedCity;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${savedCity}&units=metric&appid=${apiKey}`;
    searchWeather(url);
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        searchWeather(url);
      },
      (error) => {
        console.warn("Location not available:", error);
        search.value = "New York";
        let url = `https://api.openweathermap.org/data/2.5/weather?q=Lagos&units=metric&appid=${apiKey}`;
        searchWeather(url);
      }
    );
  }
};

searchDefault();
