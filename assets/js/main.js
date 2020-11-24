/* eslint-disable no-undef */
$(document).ready(function () {
    // Date and Time
    // function displayTime() {
    // 	var today = moment().format('MMMM Do YYYY, h:mm:ss a');
    // 	$('#currentDay').html(today);
    // }
    // displayTime();

    // ---option to add seconds to time
    // //Append current date and time to same place as 'city'
    // $('#date').append(displayTime());
    $('#submitCity').submit(function (event) {
        event.preventDefault();
    });
    //Function for getting the UVI, Temperature, Wind Speed, and Humidity
    $('button').click(function (event) {
        event.preventDefault();
        //Clear previous search data
        // $('#cityInputField').focus(function () {
        // 	$(this).val('');
        // });

        let emptyArr = [
            'location',
            'uvi',
            'temp',
            'sideIcon',
            'wind',
            'humid',
            'icon',
            'currentDay',
            'icon1',
            'dayOne',
            'dayOneSub',
            'icon2',
            'dayTwo',
            'dayTwoSub',
            'icon3',
            'dayThree',
            'dayThreeSub',
            'icon4',
            'dayFour',
            'dayFourSub',
            'icon5',
            'dayFive',
            'dayFiveSub',
        ];
        for (const clean of emptyArr) {
            $(`#${clean}`).empty();
        }

        //add class hist
        //submit city on click
        //history=btn click
        let city;
        if (this.id === 'submitCity') {
            console.log(`I hit first if statement`);
            city = $('#cityInputField').val();
        } else {
            console.log(`I hit else statement`);
            city = this.id;
        }

        var apiKey = 'f38f6a7de25e9c5bfba8b768dc8d3f45';
        var units = '&units=imperial';
        var apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}${units}`;
        var upper = city[0].toUpperCase();
        var lower = city.substring(1).toLowerCase();
        // console.log(upper+lower)
        // console.log(upper)

        //Local Storagae saves previous searches

        function save() {
            var newData = city;
            if (localStorage.getItem('search') === null) {
                localStorage.setItem('search', '[]');
            }
            var oldData = JSON.parse(localStorage.getItem('search'));
            oldData.push(newData);
            localStorage.setItem('search', JSON.stringify(oldData));
        }

        function view() {
            if (localStorage.getItem('search') != null) {
                const searches = JSON.parse(localStorage.getItem('search'));
                for (var i = 0; i < searches.length; i++) {
                    // console.log(searches[i]);
                    let searchText = searches[i];
                    $('#savedHistory').append($('<li>').text(searchText));

                    // create new element with text as searches[i]
                    // append that new element to #savedHistory
                }
            }
        }
        // view();
        //-------------------------API Call----------------------------------------------------//
        $.ajax({
            url: apiURL,
            method: 'GET',
        }).then(function (response) {
            //----------------Clear Previous Searches-----------------------------------------------//
            function info() {
                var weatherDescription = Math.floor(response.main.temp);
                var humidity = response.main.humidity;
                var windSpeed = response.wind.speed;
                var mainIcon = response.weather[0].icon;
                var mainIconURL = `http://openweathermap.org/img/wn/${mainIcon}@2x.png`;
                var iconImgMain = `<img src=${mainIconURL}></img>`;
                var weather = response.main.temp;
                var feelsLike = response.main.feels_like;

                $(`#location`).append(upper + lower);
                $('#temp')
                    .append(`Temperature:${weatherDescription}` + '°F')
                    .append(`</br>`);
                $('#wind').append(`Wind Speed:${windSpeed}`).append(`<br>`);
                $('#humid').append(`Humidity: ${humidity}`).append(`<br>`);
                $(`#sideIcon`).append(iconImgMain);

                //Main Card Back
                $('#weatherInfo').append(weather + '°F');
                $('#feel').append(feelsLike + '°F');
            }
            info();

            //-----------------------UV Index-------------------------------------------------------//
            function getUV() {
                var lat = response.coord.lat;
                var lon = response.coord.lon;
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                    method: 'GET',
                }).then(function (response2) {
                    var uvIndex = response2.value;

                    $('#uvi').append(`UV Index:${uvIndex}`).append(`<br>`);

                    if ($(uvIndex) <= 2.99) {
                        $(`#uvi`).css('background-color', 'green');
                    }
                    if (3.0 < $(uvIndex) <= 6.99) {
                        $(`#uvi`).css('background-color', 'yellow');
                    } else {
                        $(`#uvi`).css('background-color', 'red');
                    }
                });
            }
            getUV();

            //----------------------5 Day Forecast----------------------------------------------------------//
            function fiveDayForecast() {
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`,
                    method: `GET`,
                }).then(function (response3) {
                    //---------------------Retreiving and appending icon to DOM-----------------------------------//
                    //Day One Icons
                    var iconOne = response3.list[0].weather[0].icon;
                    var iconURL = `http://openweathermap.org/img/wn/${iconOne}@2x.png`;
                    var iconImg1 = `<img src=${iconURL}></img>`;
                    $(`#icon1`).append(iconImg1);
                    // console.log(iconURL);
                    // console.log(iconImg1);

                    //Day Two Icons
                    var iconTwo = response3.list[8].weather[0].icon;
                    var iconURL2 = `http://openweathermap.org/img/wn/${iconTwo}@2x.png`;
                    var iconImg2 = `<img src=${iconURL2}></img>`;
                    $(`#icon2`).append(iconImg2);
                    // console.log(iconURL2);
                    // console.log(iconImg2);

                    //Day Three Icons
                    var iconThree = response3.list[16].weather[0].icon;
                    var iconURL3 = `http://openweathermap.org/img/wn/${iconThree}@2x.png`;
                    console.log(iconURL);
                    var iconImg3 = `<img src=${iconURL3}></img>`;
                    $(`#icon3`).append(iconImg3);
                    // console.log(iconImg3);

                    //Day Four Iccons
                    var iconFour = response3.list[24].weather[0].icon;
                    var iconURL4 = `http://openweathermap.org/img/wn/${iconFour}@2x.png`;
                    console.log(iconURL4);
                    var iconImg4 = `<img src=${iconURL4}></img>`;
                    $(`#icon4`).append(iconImg4);
                    console.log(iconImg4);

                    //Day Five Icons
                    var iconFive = response3.list[32].weather[0].icon;
                    var iconURL5 = `http://openweathermap.org/img/wn/${iconFive}@2x.png`;
                    console.log(iconURL5);
                    var iconImg5 = `<img src=${iconURL5}></img>`;
                    $(`#icon5`).append(iconImg5);
                    console.log(iconImg5);

                    //----------------------Weather Data for 5 Day Forecast----------------------------------------------//
                    //Day One
                    var dayOneA = Math.floor(response3.list[0].main.temp);
                    var dayOneB = response3.list[0].main.humidity;
                    // console.log(dayOneA);
                    //Day 2 of 5
                    var dayTwoA = Math.floor(response3.list[8].main.temp);
                    var dayTwoB = response3.list[8].main.humidity;
                    //Day 3 of 5
                    var dayThreeA = Math.floor(response3.list[16].main.temp);
                    var dayThreeB = response3.list[16].main.humidity;
                    //Day 4 of 5
                    var dayFourA = Math.floor(response3.list[24].main.temp);
                    var dayFourB = response3.list[24].main.humidity;
                    //Day 5 of 5
                    var dayFiveA = Math.floor(response3.list[32].main.temp);
                    var dayFiveB = response3.list[32].main.humidity;

                    //---------------Appending 5 day forecast variables----------------------------------------------//
                    $(`#dayOne`).append(`Temperature:${dayOneA}`);
                    $(`#dayOneSub`).append(`Humidity: ${dayOneB}`);
                    //Day 2 of 5 day forecast
                    $(`#dayTwo`).append(`Temperature: ${dayTwoA}`);
                    $(`#dayTwoSub`).append(`Humidity: ${dayTwoB}`);
                    //Day 3 of 5 day forecast
                    $(`#dayThree`).append(`Temperature: ${dayThreeA}`);
                    $(`#dayThreeSub`).append(`Humidity: ${dayThreeB}`);
                    //Day 4 of 5 day forecast
                    $(`#dayFour`).append(`Temperature: ${dayFourA}`);
                    $(`#dayFourSub`).append(`Humidity: ${dayFourB}`);

                    $(`#dayFive`).append(`Temperature: ${dayFiveA}`);
                    $(`#dayFiveSub`).append(`Humidity: ${dayFiveB}`);
                });
            }

            fiveDayForecast();
        });
        save();
        view();
    });
});