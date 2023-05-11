import './App.css';
import { useState } from 'react';
import * as lookup from 'country-code-lookup';
import moment from 'moment';
import Weather from './components/weather';
import History from './components/history';

function App() {

  const [inputs, setInputs] = useState({});
  const [weatherData, setWeatherData] = useState([]);
  const [historyData, sethistoryData] = useState([]);
  const [searchingDateTime, setSearchingDateTime] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  function submitForm(event) {
    event.preventDefault();
    //disallow empty input
    let isEmptyCityName = !inputs.cityName || !inputs.cityName.trim().length;
    let isEmptyCountryName = !inputs.countryName || !inputs.countryName.trim().length;
    if(isEmptyCityName || isEmptyCountryName) {
      setError("Please enter the city and country.");        
    }
    else {    
      getWeather(inputs.cityName, inputs.countryName);     
      setInputs({});
    }
  }

  function clearInput(event) {
    event.preventDefault();  
    setInputs({});
  }

  const updateHistoryData = (cityName, countryCode, countryName, currentDateTime) => {
    let searchingData = {cityName: cityName, countryCode: countryCode, countryName: countryName, searchingDateTime: currentDateTime} 
    sethistoryData([...historyData, searchingData]);
  }

  const removeHistoryData = (history) => {
    historyData.splice(historyData.findIndex(x => (x.countryCode === history.countryCode && x.searchingDateTime === history.searchingDateTime)), 1);
    sethistoryData([...historyData]);
  }

  const searchHistoryData = (history) => {
    getWeather(history.cityName, history.countryName);
  }

  const getWeather = (cityName, countryName) => {
    //convert to title case for searching purpose
    let titleCaseCityName = titleCaseString(cityName);
    let titleCaseCountryName = titleCaseString(countryName);
    //convert to country code due to api only accept iso2
    let countryCode = lookup.byCountry(titleCaseCountryName)?.iso2;
    let currentDateTime = moment().format('YYYY-MM-DD hh:mm:ss A');

    const url = `${process.env.REACT_APP_OPEN_WEATHER_API_URL}/weather?q=${titleCaseCityName},${countryCode}&APPID=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`;
    fetch(url).then(res => handleResponse(res)).then(weather => {
      if(typeof weather !== 'undefined' && weather.length !== 0) {
        setWeatherData(weather);
        setSearchingDateTime(currentDateTime);   
        updateHistoryData(titleCaseCityName, countryCode, titleCaseCountryName, currentDateTime);
      }
    });
  }

  const titleCaseString = (str) => {
    let newStr = str.split(' ').map(s => s[0].toUpperCase() + s.substring(1).toLowerCase()).join(' ');
    return newStr;
  }

  function handleResponse(response) {
    if (response.ok) {
      setError(null);
      return response.json();
    } else {
      setWeatherData([]);
      setError("Not Found");
    }
  }
  
  return (
    <div className="container">
      <div className="title">Today's Weather</div>
      <hr/>
      <form>
        <label>City:
        <input 
          type="text" 
          name="cityName" 
          value={inputs.cityName || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Country:
          <input 
            type="text" 
            name="countryName" 
            value={inputs.countryName || ""} 
            onChange={handleChange}
          />
        </label>          
        <button onClick={submitForm}>submit</button>
        <button onClick={clearInput}>Clear</button>
      </form> 
      {error !== null && 
        <div className="alert_box">
          {error}
        </div>
      }
      {(weatherData.length !== 0) && (error === null) && (
        <div>
          <Weather weatherData={weatherData} searchingDateTime={searchingDateTime} />
        </div>
      )}
      <div className="history_container">
        <div className="title">Search History</div>
        <hr/>
        {historyData.length !== 0 &&
          <History historyData={historyData} onClickSearch={searchHistoryData} onClickRemove={removeHistoryData} />
        }
        {historyData.length === 0 &&
          <div className="norecord_msg">No Record</div>
        }
      </div>
    </div>
  )
}

export default App;
