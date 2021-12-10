var submitEl = document.querySelector("#submit");
var inputCityEl = $('#input-City');
var cityTitleEl = $('#city-Title');
var actualDayCardEl = $('#actual-Day-Card');
var actualValuesUlEl = $('#actual-Values');
var cityButtonsEl = document.querySelector('#city-Buttons');
//var deleteHistoryEl = document.querySelector('#delete-History');


function inputValidation(event){
    // Prevent default action
    event.preventDefault();
    searchValue = inputCityEl.val();
    if (searchValue){
        console.log('city value search: ',searchValue);
        getWeatherValuess(searchValue);
    } else {
        alert('Put any city value');        
    }
}

var getWeatherValuess = function (cityValue) {

    var apiKey = 'f86d8303bef133edf31e012bce416fc1';
    
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+cityValue+'&appid='+apiKey+'&units=metric';
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('data response');
            console.log(data); 
            actualCity = data.name+' '+data.sys.country;            
            searchCityValues(data,actualCity);
            saveCityOnLocalStorage(data.name);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather API');
      });
  };

  var searchCityValues = function (data,actualCity){
    
    var apiKey = 'f86d8303bef133edf31e012bce416fc1';
    var lon = data.coord.lon;
    var lat = data.coord.lat;    
    console.log('Lon and Lat city: '+data.name+' '+lon+' '+lat);
    var currentDateTimestamp = Date.now();
    //console.log('Current timestamp: ',currentDateTimestamp);
    var apiUrlWeather = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely&dt='+currentDateTimestamp+'&appid='+apiKey+'&units=metric';
    
    
    fetch(apiUrlWeather)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('data response');
            console.log(data);            
            displayCityWeather(data,actualCity);

          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather API');
      });

  };

  

  var displayCityWeather = function (data,actualCity){

    currentDateTimestamp = data.current.dt*1000;    
    var actualDate  = new Date(currentDateTimestamp).toLocaleDateString("en-US");   
    console.log('Actual date ',actualDate);
    //console.log('Wind speed: ',data.current.wind_speed);
      
    //display actual city and date
    //cityTitleEl.text(actualCity+' ('+actualDate+')');
    cityTitleEl.html('');
    var weatherIcon = data.current.weather[0].icon;
    //console.log('Weather icon value: ',weatherIcon);
    cityTitleEl.html(actualCity+' ('+actualDate+')'+ '<img src="http://openweathermap.org/img/wn/'+ weatherIcon +'@2x.png" alt="Weather Img" widht="50" height="50"></img>');

    //*****display weather values in actual day Card*****
    actualValuesUlEl.text(''); //delete actual values of ul    
    actualValuesUlEl.attr('class', 'li-weather');

    liEl = $('<li>');    
    liEl.text('Temp: '+data.current.temp +' '+ String.fromCharCode(176) + 'C');
    actualValuesUlEl.append(liEl); 
    
    liEl = $('<li>');    
    liEl.text('Wind: '+data.current.wind_speed + ' MPH');
    actualValuesUlEl.append(liEl);

    liEl = $('<li>');
    liEl.text('Humidity: '+data.current.humidity + ' %');
    actualValuesUlEl.append(liEl);

    liEl = $('<li>');
    liEl.text('Uv Index: ');
    

    spanEl = $('<span>');

    actualUv = data.current.uvi;
    //actualUv = parseInt(actualUv);
    switch (true) {
        case (actualUv <=3):
            spanEl.attr('class','bg-uv bg-favorable');
            break;
        case (actualUv > 3 && actualUv <=6):
            spanEl.attr('class','bg-uv bg-moderate');
            break;
        case (actualUv > 6):
            console.log('actualUv More than 6');
            spanEl.attr('class','bg-uv bg-severe');
            break;        
      }
    
    spanEl.text(actualUv); //add Uv value to span
    liEl.append(spanEl); //add span to list element li

    actualValuesUlEl.append(liEl);    //add lists to ul

    actualDayCardEl.append(actualValuesUlEl); //refresh actual day card with values of Ul

    //*****display weather values in for the next 5 days in five-Days-Card*****
    var fiveDaysCard  = $('#five-Days-Card');
    fiveDaysCard.text('');

    for (var i = 1; i <= 5; i++) {

        //responsive div
        var divEl = $('<div>');
        divEl.attr('class', 'col-12 col-sm-6 col-lg-4 mb-3');
        fiveDaysCard.append(divEl);

        //card div
        var divCardEl = $('<div>');
        divCardEl.attr('class', 'card');
        divEl.append(divCardEl);

        //header card
        var h4El = $('<h4>');
        h4El.attr('class','card-header bg-blue text-white');
        dayDateTimestamp = data.daily[i].dt*1000;    
        var dayDate  = new Date(dayDateTimestamp).toLocaleDateString("en-US"); 
        var weatherIconDay = data.daily[i].weather[0].icon;
        //console.log('Weather day icon value: ',weatherIconDay);
        h4El.html(dayDate+ '<img src="http://openweathermap.org/img/wn/'+ weatherIcon +'@2x.png" alt="Weather Img" widht="40" height="40"></img>');

        //h4El.text(dayDate);
        divCardEl.append(h4El);

        //card body
        var divCardBodyEl = $('<div>');
        divCardBodyEl.attr('class','card-body');
        divCardEl.append(divCardBodyEl);

        //*****display weather values in actual day Card*****
        //ul for values li elements
        var ulEl = $('<ul>');
        ulEl.attr('class', 'li-weather');

        var liEl = $('<li>');    
        liEl.text('Temp: '+data.daily[i].temp.day +' '+ String.fromCharCode(176) + 'C');
        ulEl.append(liEl); 
        
        liEl = $('<li>');    
        liEl.text('Wind: '+data.daily[i].wind_speed + ' MPH');
        ulEl.append(liEl);

        liEl = $('<li>');
        liEl.text('Humidity: '+data.daily[i].humidity + ' %');
        ulEl.append(liEl);

        liEl = $('<li>');
        liEl.text('Uv Index: '+data.daily[i].uvi);
        ulEl.append(liEl);

        divCardBodyEl.append(ulEl); //refresch actual day card with values

    }


  };



var saveCityOnLocalStorage = function(city){
    
    var cityLocalStorage = JSON.parse(localStorage.getItem("cityWeather"));

    if (!cityLocalStorage) {
        console.log('there is no variable on local storage');        
        var cityWeather = [city];        
        //Save on local storage the cityWeather Array
        localStorage.setItem("cityWeather", JSON.stringify(cityWeather));
        displayCityButtons();
        //if there is any value on local storage
    } else{   
        console.log('There is an array variable on local storage');  
        
        //if the value exist into the array dont save
        var positionCityArray = jQuery.inArray(city,cityLocalStorage);
        //console.log('City array position: ',positionCityArray);
        if  (positionCityArray !== -1){
            //dont do anything
            console.log('The city exist on the localstorage');
        }

        //if the value does not exist save it
        else {        
            //add a value in the array
            console.log('A new value was storage on local array')
            var actualCityArray = cityLocalStorage;
            actualCityArray.push(city);
            localStorage.setItem("cityWeather", JSON.stringify(actualCityArray));
            displayCityButtons();   
        }

             
    }

}

var deleteHistory = function () {
    localStorage.removeItem("cityWeather");
    console.log('Array History deleted');
    var cityButtonEl = $('#city-Buttons');  
    //Delet innerHtml cityButtons div
    cityButtonEl.html('');
    //displayCityButtons(); 
};


var buttonClickHandler = function (event) {
    var city = event.target.getAttribute('data-city');  
    if (city) {
        console.log('Click on city: ',city);
        getWeatherValuess(city);
    }
};


var displayCityButtons = function (){
    var cityLocalStorage = JSON.parse(localStorage.getItem("cityWeather"));

    if (!cityLocalStorage) {
        console.log('there is no variable on local storage');        
        //location.reload();
    //if there is any value on local array display cities buttons
    } else{   
        console.log('There is an array variable on local storage'); 
        
        var cityButtonEl = $('#city-Buttons');  
        //Delet innerHtml cityButtons div
        cityButtonEl.html('');

        //add the city buttons on div 
        for (var i = 0; i < cityLocalStorage.length; i++) {
            console.log('array value ',i,' ',cityLocalStorage[i]);         
            var buttonEl = $('<button>');
            buttonEl.text(cityLocalStorage[i])
            buttonEl.attr('class','btn btn-secondary');
            buttonEl.attr('data-city',cityLocalStorage[i]);
            buttonEl.attr('type','button');
           //  buttonEl.on('click', getHistoryValues);                                  
            cityButtonEl.append(buttonEl);
        }//end for

        //delet history button
        buttonEl = $('<button>');
        buttonEl.text('Delete History')
        buttonEl.attr('class','btn btn-dark');
        buttonEl.attr('data-city',cityLocalStorage[i]);
        buttonEl.attr('type','button');
        buttonEl.attr('id','delete-History');
        buttonEl.on('click', deleteHistory);
        cityButtonEl.append(buttonEl);
        

        


    }//end else if there is any value on local array
}


var getHistoryValues = function (){

};

displayCityButtons();


  // Add listener to submit elements
submitEl.addEventListener("click", inputValidation);
cityButtonsEl.addEventListener('click', buttonClickHandler);
//deleteHistoryEl.addEventListener('click', deleteHistory);