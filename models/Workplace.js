const Database = require("../models/utility/database");
class Workplace{

    #name
    #latitude
    #longitude
    static WorkplaceConverter = {
		toFirestore: (workplace) => {
			return {
				name: workplace.name,
                latitude: workplace.latitude,
                longitude: workplace.longitude
			};
		},
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options);

		
			let workplace = new Workplace(data.name, data.latitude,data.longitude);
		

			return workplace 
		}
	};
    constructor(name, latitude, longitude ){
        this.name = name
        
        this.latitude = latitude
        this.longitude = longitude      
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get latitude() {
        return this._latitude;
    }

    set latitude (value) {
        this._latitude = value;
    }
    
    get longitude() {
        return this._longitude;
    }

    set longitude(value) {
        this._longitude = value;
    }


    checkLocation(latitude,longitude, workplace){

        //remove the negative to allow operation
        workplace.latitude = Math.abs(workplace.latitude)
        workplace.longitude = Math.abs(workplace.longitude)
     //   console.log(latitude)
      //  console.log(longitude)
        // console.log("______")
        // console.log( workplace.latitude -0.001)
        // console.log(workplace.latitude + 0.001)
        // console.log( workplace.longitude -0.001)
        // console.log(workplace.longitude + 0.001)
        

        //checks if the provided latitude and Longitude is within range of the workplace geolocation
        if ((latitude>= workplace.latitude -0.001 && latitude <= workplace.latitude + 0.001) && (longitude >= workplace.longitude - 0.001 && longitude <= workplace.longitude + 0.001)){
            return true //if yes return true, to allow further operation
          }else{
            return false//if no, end operation
          }

    }
       
}
module.exports = Workplace;