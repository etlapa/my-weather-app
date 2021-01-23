import { ICity } from "./ICity";

export class City implements ICity{
    constructor(public name:string,public country:string,public temp?:Number,public icon?:String,){}
}