



/*const dropdownArrow = document.querySelector(".dropdown-arrow");

const Dropdown = document.getElementById("dropdown");

const Unit = document.querySelectorAll(".unit");

dropdownArrow.addEventListener("click" , () =>{
  if(Dropdown.style.display === "none"){
    Dropdown.style.display = "flex";
  } else {
    Dropdown.style.display = "none";
  }
});*/

const SearchBtn = document.getElementById("searchBtn");

SearchBtn.addEventListener("click" , async(e) => {
    e.preventDefault();
    const city = document.getElementById("search-input").value.trim();
    if(!city){
      return alert("Please enter a city here..")
    }
    try{
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);

      const geoData = await geoRes.json();

      if(!geoData.results || geoData.results.length=== 0){
        document.querySelector(".cityPlusCountry").textContent = "City not found";

        return ;
      }

      const {latitude , longitude , name , country} = geoData.results[0];

      // Update location in UI

      document.querySelector(".cityPlusCountry").textContent = `${name}, ${country}`;

      fetchWeather(latitude , longitude);

      console.log(geoData);
    } catch(error){
      console.log(error);
    }
});

async function fetchWeather(lat , lon){
  const APIkey = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation`;

  try{
    const res = await fetch(APIkey);
    const data = await res.json();
    console.log(data);

    // Update current weather

    const current = data.current ;
    const formattedDate = new Date(current.time).toLocaleDateString("en-US" , {
        weekday : "long",
        day : "numeric",
        month: "short",
        year : "numeric",
    });

    document.querySelector(".Date").textContent = formattedDate;

    document.querySelector(".weather-main h2").innerHTML = `${Math.round(data.current.temperature_2m)}&deg;`;

    document.querySelector(".feels_like").innerHTML = `${Math.round(data.current.apparent_temperature)}&deg;`;

    document.querySelector(".humidity").innerHTML = `${data.current.relative_humidity_2m}%` ;

    document.querySelector(".wind-speed").innerHTML = `${data.current.wind_speed_10m}km/h`;

    document.querySelector(".Precipitation").innerHTML = `${data.current.precipitation}mm`;

    // daily forecast 

    const dailyContainer = document.querySelector(".daily_forecast-main");

    dailyContainer.innerHTML = "";

    data.daily.time.forEach((date , i) => {

      const dayName = new Date(date).toLocaleDateString("en-US" , {weekday: "short"});

      dailyContainer.innerHTML += `
          <div class="card-forecast">
              <p>${dayName}</p>
              <img src="./assets/images/icon-drizzle.webp" alt="">
              <div class="temps">
                <p class="max">${Math.round(data.daily.temperature_2m_max[i])}&deg;</p>
                <p class="min">${Math.round(data.daily.temperature_2m_min[i])}&deg;</p>
              </div>
            </div>
      `;

      // Update hourly forecast

      const hourlyContainer = document.querySelector(".hours");

      hourlyContainer.innerHTML = "";
      data.hourly.time.forEach((time , i) =>{
          const hour = new Date(time).toLocaleTimeString("en-US" , {hour: "numeric"});

          hourlyContainer.innerHTML += `
            <div class="single-hour">
              <div class="time">
                <img src="./assets/images/icon-overcast.webp" alt="">
                <p>${hour}</p>
              </div>
              <p>${Math.round(data.hourly.temperature_2m[i])}&deg;</p>
            </div>
          `;
      });

    });
  } catch(error){
    console.log(error);
  }
}

/*async function fetchCity(){
  try{
    const response = await fetch(APIkey);

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch(error) {
    console.error("Error fetching data:" , error)
  }

}

fetchCity();*/

/*const formField = document.getElementById("form-field");
const SearchBtn = document.getElementById("searchBtn");
const SearchInput = document.getElementById("search-input");

const City = document.getElementById("city");
const Temperature = document.getElementById("current-temperature");
const Country = document.getElementById("country");
const windSpeed = document.getElementById("current-windspeed");
const Humidity = document.getElementById("current-humidity");
const apparentTemp = document.getElementById("current-apparentTemp");
const preciPitation = document.getElementById("current-precip");

const Card = document.querySelectorAll(".card");



const loadingIndicator = document.getElementById("loading-indicator");

const searchProgress = document.querySelector(".search-progress");

const forecastContainer = document.getElementById("daily-forecast");

const hourlyForecastContainer = document.getElementById("hourly-forecast");

const Today = document.getElementById("today");
const Hourly = document.getElementById("hourly");


const ShowFeel = document.getElementById("showFeels");
const ShowHumidity = document.getElementById("showHumidity");
const ShowWind = document.getElementById("showWind");
const ShowPrecip = document.getElementById("showPrecip");




// Building a simple flow 

function populateDropdown(dailyTime){
  const dropdown = document.querySelector("#myDropdown");
  dropdown.innerHTML = "";

  dailyTime.forEach((date,index) => {
    const option = document.createElement("option");
    option.value = index;

    /*if(index=== 0){
      option.textContent = "Today";
    }else {
      option.textContent = new Date(date).toLocaleDateString("en-US" , { weekday: "long"});
    }*/
    /*option.textContent = new Date(date).toLocaleDateString("en-US" , {weekday : "long"});

    dropdown.appendChild(option);
  });

  dropdown.value=0;
}


SearchBtn.addEventListener("click" , (e) => {
  e.preventDefault();

  searchProgress.style.display = 'inline-block';

  setTimeout(() => {
    searchProgress.style.display = 'none';
    getCity(SearchInput.value);

  } , 1000);
   
});

async function getCity(city){
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status};`)
    }

    const cityData = await response.json();

    let latitude , longitude , name , country ;

    if (cityData.results && cityData.results.length > 0) {
      ({ name, country, longitude, latitude } = cityData.results[0]);
      
      } else {
      console.log("No results found");
      return ;
    }

    const WeatherData = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=precipitation,relative_humidity_2m,temperature_2m,apparent_temperature,wind_speed_10m`);



    const FinalData = await  WeatherData.json();
    console.log(FinalData);
    Today.style.display = "flex";
    Hourly.style.display = "flex";
    Card.forEach( c=> c.style.display = "flex");
    City.textContent = ` ${name}`;
    Country.textContent = ` ${country}`;
    Temperature.textContent = `${FinalData.current.temperature_2m}`;

    ShowWind.textContent = "Wind";
    windSpeed.textContent =`${FinalData.current.wind_speed_10m}` ;

    ShowFeel.textContent = "Feels Like";
    apparentTemp.textContent = `${FinalData.current.apparent_temperature}`;


    ShowHumidity.textContent = "Humidity";
    Humidity.textContent = `${FinalData.current.relative_humidity_2m}`;


    ShowPrecip.textContent = "Precipitation" ;
    preciPitation.textContent = `${FinalData.current.precipitation}`;
    
    
    
    
    

    // Getting the data for the daily forecast
    function displayDailyforecast(daily){
      forecastContainer.innerHTML = "";

      const days  = daily.time.length;

      for (let i = 0; i < days ; i++){
        const date = daily.time[i];
        const maxTemp = daily.temperature_2m_max[i];
        const minTemp = daily.temperature_2m_min[i];
        


        const dayCard = document.createElement("div");

        dayCard.innerHTML = `
          <p>${new Date(date).toLocaleDateString("en-US" , {weekday : "long"})}</p>
          <p>Max: ${maxTemp}</p>
          <p>Min: ${minTemp}</p>
        `;

        forecastContainer.appendChild(dayCard);
      }
    }

    displayDailyforecast(FinalData.daily);


    // Hourly Forecast

    function displayHourlyforecast(hourly , dailyTime){


      const days = [];

      for (let i = 0; i < hourly.time.length ; i+=24){
        const oneDay = {
          time: hourly.time.slice(i , i + 24),
          temp: hourly.temperature_2m.slice(i , i + 24),
          code : hourly.weather_code.slice(i , i + 24),
        };
        days.push(oneDay)
      }
      function displayDayHourlyForecast(dayIndex){

        hourlyForecastContainer.innerHTML ="";

        const day = days[dayIndex];

        for(let i = 0 ; i < day.time.length ; i++){
          const hour = day.time[i];
          const temp = day.temp[i];


          const hourItem = document.createElement("div");
          hourItem.classList.add("hourly-item")

          hourItem.innerHTML = `

            <span>${hour.slice(11,16)}</span>
            <span>${temp}</span>
            
          `;
          hourlyForecastContainer.appendChild(hourItem)
        }

      }

      populateDropdown(dailyTime);
      displayDayHourlyForecast(0) // Auto-displayToday

      document.querySelector("#myDropdown").  addEventListener("change" , (e) => {
        const selectedDay = parseInt(e.target.value);
        displayDayHourlyForecast(selectedDay);
      });
      

    }
    

  displayHourlyforecast(FinalData.hourly , FinalData.daily.time);

  }catch (error) {
    console.log('Error fetching data:' , error);
  }
}
*/

