import { IWeather } from "./IWeatherChildNode";

export interface IWeatherResponse{
    "coord": {
        "lon": Number,
        "lat": Number
    },
    "weather": IWeather[],
    "base": String,
    "main": {
        "temp": number,
        "feels_like": number,
        "temp_min": number,
        "temp_max": number,
        "pressure": number,
        "humidity": number
    },
    "visibility": Number,
    "wind": {
        "speed": number,
        "deg": Number,
        "gust"?: Number
    },
    "snow"?: {
        "1h": Number
    },
    "rain"?: {
        "1h": Number
    },
    "clouds": {
        "all": Number
    },
    "dt": Number,
    "sys": {
        "type": Number,
        "id": Number,
        "country": string,
        "sunrise": Number,
        "sunset": Number
    },
    "timezone": Number,
    "id": Number,
    "name": string,
    "cod": Number
}