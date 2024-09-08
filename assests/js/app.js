let countryP = $(".country");
let idP = $(".temp_c");
let nameP = $(".name");
let localtime = $(".date");
let img = document.getElementById("weatherIcon");
let localtimeElement = $(".time");
let wind_kph = $(".windSpeedP");
let conditionText = $(".weatherCondition");
let province = $(".provinceP");

let sunRise = $(".sunriseP");
let sunSet = $(".sunsetP");

let humidity = $(".humidityP");
let windDirection = $(".windDirec");

const apiKey = "a66640216bab455b99a50251240609";


//   location
function handleSearch() {
    const location = document.getElementById("location-input").value;
    fetchData(location);
}
document.getElementById("search-button").addEventListener("click", handleSearch);

function fetchData(location) {
    $.ajax({
      method: "GET",
      // url: `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
      url: `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=6`,
      success: ({ location, current , forecast }) => {
        countryP.text(location.country);
        idP.text(current.temp_c.toLocaleString(undefined,{style:"unit",unit:"celsius"}));
        nameP.text(location.name);
        img.src = current.condition.icon;

        //get date and time
        const dateTime = location.localtime;
        const dateObject = new Date(dateTime);

        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObject.toLocaleDateString(undefined, dateOptions);

        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const formattedTime = dateObject.toLocaleTimeString(undefined, timeOptions);

        localtime.text(formattedDate);
        localtimeElement.text(formattedTime);
        
        wind_kph.text(current.wind_kph + "kph");
 
        conditionText.text(current.condition.text);

        province.text(location.region ? ` ${location.region}` : " ");
        

        const astro = forecast.forecastday[0].astro;
        sunRise.text(`${astro.sunrise}`);
        sunSet.text(`${astro.sunset}`);

        humidity.text(current.humidity);
        windDirection.text(current.wind_dir);

        const forecastContainer = $('#forecast-container');
        forecastContainer.empty();

      forecast.forecastday.forEach(day => {
        const forecastDate = new Date(day.date);
        const dayName = forecastDate.toLocaleDateString(undefined, { weekday: 'long' });
        const temp = day.day.avgtemp_c.toLocaleString(undefined, { style: "unit", unit: "celsius" });
        const icon = day.day.condition.icon;
        const rainChance = day.day.daily_chance_of_rain;
        const windSpeed = day.day.maxwind_kph;

        const forecastHTML = `
          <div class="col day-card">
            <h5>${dayName}</h5>
            <p>${temp}</p>
            <img src="${icon}" alt="${day.day.condition.text}">
            <p>${rainChance}% Rain <h3><i class="bi bi-umbrella"></i></h3></p>
            <p>${windSpeed} km/h <h3><i class="bi bi-wind"></i></h3></p>
          </div>
        `;

        forecastContainer.append(forecastHTML);
      });
    }
  });
}


const newsApiKey = "6dc7b78bab994b35abaa09b2d8ca07a6";

function loadWeatherNews() {
  const url = `https://newsapi.org/v2/everything?q=weather&apiKey=${newsApiKey}`;

  $.ajax({
    method: "GET",
    url: url,
    success: function(response) {
      const articles = response.articles.slice(0, 6); 
      const newsContainer = $('#news-container');
      newsContainer.empty();

      articles.forEach(article => {
        const newsHTML = `
          <div class="news-card col-lg-4 col-md-4 col-xs-12">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          </div>
        `;
        newsContainer.append(newsHTML);
      });
    },
    error: function(error) {
      console.error("Error fetching news:", error);
      $('#news-container').html('<p>Unable to load news at this time.</p>');
    }
  });
}

loadWeatherNews();


// enter key function
document.getElementById("location-input").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearch();
  }
});