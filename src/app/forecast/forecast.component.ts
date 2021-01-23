import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CityService } from '../api/cities/city-service';
import { IDetails } from '../api/cities/IDetails';
import { WeatherService } from '../api/cities/weather-service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
  providers: [CityService]
})
export class ForecastComponent implements OnInit {
  details: IDetails | null;

  constructor(private route:ActivatedRoute,private cityService:CityService) {
    this.details = null;
  }

  ngOnInit(): void {
    let city = this.route.snapshot.paramMap.get('city');
    console.log(city);
    this.details = this.cityService.getDetails(city);
    console.log("response outside: "+this.details);
  }

}
