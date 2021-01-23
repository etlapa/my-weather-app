import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { IWeatherResponse } from "./IWeatherResponse";

@Injectable({
    providedIn: 'root'
})
export class WeatherService{
    private appId = '45233fa867b9d67efe722a53155ae26f';
    private url = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&appid='+this.appId;

    constructor(private http: HttpClient){}

    getWeatherByZip(zipCode:String):Observable<IWeatherResponse>{
        return this.http.get<IWeatherResponse>(this.url + '&zip=' + zipCode);
    }
    getWeatherByName(cityName:String):Observable<IWeatherResponse>{
        return this.http.get<IWeatherResponse>(this.url + '&q=' + cityName);
    }
}