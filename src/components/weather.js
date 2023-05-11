import React from 'react';

export default function weather({weatherData, searchingDateTime}) {

    let temperatureMax = parseFloat(weatherData.main.temp_max - 273.15).toFixed(2) + '°C';
    let temperatureMin = parseFloat(weatherData.main.temp_min - 273.15).toFixed(2) + '°C';
    let temperatureRange = temperatureMin + ' ~ ' + temperatureMax;

    return(
        <>
            <div className="weather_container">
                <div className="weather_title">{weatherData.name},{weatherData.sys.country}</div>
                <div className="weather_highlight">{weatherData.weather[0].main}</div>
                <div className="weather_row">
                    <div className="weather_title">Description: </div>
                    <div className="weather_content">{weatherData.weather[0].description}</div>
                </div>
                <div className="weather_row">
                    <div className="weather_title">Temperature: </div>
                    <div className="weather_content">{temperatureRange}</div>
                </div>
                <div className="weather_row">
                    <div className="weather_title">Humidity: </div>
                    <div className="weather_content">{weatherData.main.humidity}%</div>
                </div>
                <div className="weather_row">
                    <div className="weather_title">Time: </div>
                    <div className="weather_content">{searchingDateTime}</div>
                </div>
            </div>
        </>
    )
}