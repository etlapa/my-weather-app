import { Component, Injectable } from "@angular/core";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { City } from "./City";
import { ICity } from "./ICity";
import { IDetails } from "./IDetails";
import { IWeatherResponse } from "./IWeatherResponse";
import { WeatherService } from "./weather-service";

@Injectable({
    providedIn: "root"
})
export class CityService{
    private static LOAD_DEFAULTS = false;
    private cachedCities: ICity[] = [];
    constructor(private service:WeatherService){}
    private loadDefaultCities(): ICity[]{
        return [{name: "New York",country: "US"},
                {name: "San Francisco",country: "US"},
                {name: "Chicago",country: "US"}];
    }
    public isCityCached(city:ICity):boolean{
        let found = false;

        for(let cachedCity of this.cachedCities){
            if((city.name+city.country)===(cachedCity.name+cachedCity.country)){
                found = true;
                break;
            }
        }

        return found;
    }
    public addCachedCities(city:ICity):void{
        console.log("addCachedCities: ["+city+"], json: ["+JSON.stringify(city)+"]");
        if(!this.isCityCached(city)){
            console.log("isCityCached: ["+city+"]");
            this.cachedCities.push(city);
            let json = JSON.stringify(city);
            let itemKey = 'c'+this.getTotalStoreItems();
            console.log("json:["+json+"]");
            localStorage.setItem(itemKey,json);
            console.log("after set: ["+localStorage.getItem(itemKey)+"] at key: ["+itemKey+"]");
            localStorage.setItem('total',(this.getTotalStoreItems()+1).toString());
            this.displayContent();
        }
    }
    private displayContent():void{
        let total = this.getTotalStoreItems();
        if(total>0){
            for(let i=0;i<total;i++){
                console.log("content for c"+i+" ["+localStorage.getItem('c'+i) + "]");
            }
        }
    }
    private refreshCached():void{
        localStorage.clear();
        for(let i=0;i<this.cachedCities.length;i++){
            localStorage.setItem('c'+i,JSON.stringify(this.cachedCities[i]));
        }
        localStorage.setItem('total',this.cachedCities.length.toString());
    }
    public removeCachedCity(cityName:string):ICity[]{
        this.cachedCities = this.cachedCities.filter(city=>(city.name+city.country)!==cityName);
        this.refreshCached();
        return this.getCachedCities();
    }
    private getCachedCities(): ICity[]{

        if(this.cachedCities.length===0){
            this.loadCities();
        }

        return this.cachedCities;
    }
    private loadCities(){
        let miStorage = window.localStorage;

        if(CityService.LOAD_DEFAULTS||localStorage.getItem('total')===null){
            let defaultCities = this.loadDefaultCities();
            for(let i=0;i<defaultCities.length;i++){
                localStorage.setItem('c'+i,JSON.stringify(defaultCities[i]));
            }
            localStorage.setItem('total',defaultCities.length.toString());
        }

        for(let i=0;i<this.getTotalStoreItems();i++){
            let city = localStorage.getItem('c'+i);
            if(city){
                this.cachedCities.push(JSON.parse(city));
            }
        }
        this.displayContent();
    }
    private getTotalStoreItems():number{
        let totalStr = localStorage.getItem('total');
        totalStr = (totalStr)?totalStr:"0";
        let total: number = parseInt(totalStr);
        return total;
    }
    public getCities(): ICity[]{

        this.getCachedCities().forEach(city=>{

            this.service.getWeatherByName(city.name+','+city.country).subscribe({
                next: weather => {
                    this.updateWeather(city,weather);
                },
                error: err => console.log( "my error: "+err )
            });
            
        });

        return this.getCachedCities();
    }
    public getDetails(city:string | null):IDetails{

        let response : IDetails = {};

        if(city!=null){
            this.service.getWeatherByName(city).subscribe({
                next: weather => {
                    console.log(weather);
                    response.name = weather.name;
                    response.description = weather.weather[0].description,
                    response.temp = weather.main.temp,
                    response.feelsLike = weather.main.feels_like,
                    response.min = weather.main.temp_min,
                    response.max = weather.main.temp_max,
                    response.pressure = weather.main.pressure,
                    response.humidity = weather.main.humidity,
                    response.windSpeed = weather.wind.speed
                    //  response = {
                    //     name: weather.name,
                    //     description: weather.weather[0].description,
                    //     temp: weather.main.temp,
                    //     feelsLike:weather.main.feels_like,
                    //     min:weather.main.temp_min,
                    //     max:weather.main.temp_max,
                    //     pressure:weather.main.pressure,
                    //     humidity:weather.main.humidity,
                    //     windSpeed:weather.wind.speed
                    // } as IDetails
                },
                error: err => console.log( "my error: "+err )
            });
        }

        return response;
    }
    private updateWeather(city:ICity,iWeatherResponse:IWeatherResponse):void{
        if(iWeatherResponse&&iWeatherResponse.weather.length>0){
            city.temp = iWeatherResponse.main.temp;
            city.icon = iWeatherResponse.weather[0].icon;
        }
    }
    public parseCity(iWeatherResponse:IWeatherResponse):ICity{
        let city:ICity = new City(iWeatherResponse.name,iWeatherResponse.sys.country);
        if(iWeatherResponse&&iWeatherResponse.weather.length>0){
            city.temp = iWeatherResponse.main.temp;
            city.icon = iWeatherResponse.weather[0].icon;
        }
        return city;
    }
}