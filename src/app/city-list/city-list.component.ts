import { Component, OnInit } from "@angular/core";
import { CityService } from "../api/cities/city-service";
import { ICity } from "../api/cities/ICity";
import { IWeatherResponse } from "../api/cities/IWeatherResponse";
import { WeatherService } from "../api/cities/weather-service";

@Component({
    selector:       'city-list',
    templateUrl:    './city-list.component.html',
    providers:      [CityService, WeatherService]
})

export class CityListComponent implements OnInit{
    msgClass: string = 'warningMsg';
    displayMessage: boolean = false;
    message: string = '';
    inputZip: string = '';
    cities: ICity[] = [];
    constructor(private cityService:CityService,private weatherService:WeatherService){}
    addCityByZipCode():void{

        if(this.inputZip){
            this.loadCityWeather();
        }

    }
    private loadCityWeather():void{
        this.weatherService.getWeatherByZip(this.inputZip).subscribe({
            next: weather => {
                let city = this.cityService.parseCity(weather);
                if(this.cityService.isCityCached(city)){
                    this.displayWarningMessage(weather.name);
                }else{
                    this.cityService.addCachedCities(city);
                    this.addCityWeather(city);
                }
            },
            error: err => this.displayErrorMessage()
        });
    }
    private addCityWeather(city:ICity):void{
        this.inputZip = '';
    }
    private displayWarningMessage(city:string):void{
        this.showMessage(city+' already added for ['+this.inputZip+'] zip code','warningMsg');
    }
    private displayErrorMessage():void{
        this.showMessage('City not found with ['+this.inputZip+'] zip code','errorMsg');
    }
    private showMessage(message:string,className:string):void{
        this.msgClass = className;
        this.inputZip = '';
        this.message = message;
        this.displayMessage = true;
        setTimeout(()=>{
            this.displayMessage = false;
            this.message = '';
        },2000);
    }
    removeCity(cityName:string):void{
        this.cities = this.cityService.removeCachedCity(cityName);
    }
    ngOnInit(): void {
        this.cities = this.cityService.getCities();
    }
}