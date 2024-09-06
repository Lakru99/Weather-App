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
      url: `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`,
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
        
        // sunrise and sunset
        const astro = forecast.forecastday[0].astro;
        sunRise.text(`${astro.sunrise}`);
        sunSet.text(`${astro.sunset}`);

        humidity.text(current.humidity);
        windDirection.text(current.wind_dir);
    }
  });
}

// enter key function
document.getElementById("location-input").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearch();
  }
});