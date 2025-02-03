const cityInput = document.querySelector(".input-city");
const searchBtn = document.querySelector(".search-btn");
const apiKey = "2504fd6b7efa7d602d35a65466677f74";
const errorSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const countryText = document.querySelector(".country-text");
const tempText = document.querySelector(".temp-text");
const conditionText = document.querySelector(".weather-condition");
const humidityText = document.querySelector(".humidity-text");
const windText = document.querySelector(".wind-text");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateText = document.querySelector(".current-date-text");
const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    console.log(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

const updateWeatherInfo = async (city) => {
  const weatherData = await getFetchData("weather", city); // Await the promise here
  if (weatherData.cod != 200) {
    showDisplaySection(errorSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryText.textContent = country;
  tempText.textContent = Math.round(temp) + " °C";
  conditionText.textContent = main;
  humidityText.textContent = humidity;
  windText.textContent = speed + " M/s";
  weatherSummaryImg.src = `./assets/images/thumbnails/${getWeatherIcon(id)}`;
  currentDateText.textContent = getCurrentDate();
  await updateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);
};

const updateForecastsInfo = async (city) => {
  const forecastsData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecastItemsContainer.innerHTML = "";
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastsItems(forecastWeather);
    }
  });
};

const updateForecastsItems = (weatherData) => {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date();
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);
  const forecastItem = `
  <div class="forecast-item shrink-0 flex flex-col justify-center items-center px-3 py-1 rounded-lg gap-y-1 bg-[rgba(255,255,255,0.3)] hover:bg-[rgb(0,0,0,0.1)] transition duration-2000">
    <h4 class="forecast-item date text-xs text-white">
      ${dateResult}
    </h4>
    <img src="/assets/images/thumbnails/${getWeatherIcon(
      id
    )}" class="size-8" alt="">
    <h4 class="forecast-item-temp text-white font-bold text-xs">
      ${Math.round(temp)}
    </h4>
  </div>`;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
};

const showDisplaySection = (section) => {
  [weatherInfoSection, searchCitySection, errorSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "block";
};
showDisplaySection(searchCitySection);

const getWeatherIcon = (id) => {
  if (id <= 232) return "thunderstorm.png";
  if (id <= 321) return "drizzle.png";
  if (id <= 531) return "rain.png";
  if (id <= 622) return "snow.png";
  if (id <= 781) return "atmosphere.png";
  if (id == 800) return "clear.png";
  else return "clouds.png";
};

const getCurrentDate = () => {
  const currentDate = new Date();
  const option = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("em-GB", option);
};
