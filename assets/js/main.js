/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
$(document).ready(function () {
	// Date and Time
	function displayTime() {
		var today = moment().format('MMMM Do YYYY, h:mm:ss a');
		$('#currentDay').html(today);
	}
	console.log(displayTime());

	// ---option to add seconds to time
	// //Append current date and time to same place as 'city'
	$('#date').append(displayTime());
	$('#submitCity').submit(function (event) {
		event.preventDefault();
	});
	//Function for getting the UVI, Temperature, Wind Speed, and Humidity
	$('button').click(function (event) {
		event.preventDefault();

		//Clear previous search data
		let emptyArr = [
			'location',
			'uvi',
			'temp',
			'sideIcon',
			'wind',
			'humid',
			'icon',
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
		var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}${units}`;

		//Local Storagae saves previous searches

		function save() {
			$('#savedHistory').empty();

			var newData = city;
			if (localStorage.getItem('search') === null) {
				localStorage.setItem('search', '[]');
			}
			var oldData = JSON.parse(localStorage.getItem('search'));
			if (oldData.includes(newData)) {
				console.log('this already exists');
			} else {
				oldData.push(newData);
			}
			localStorage.setItem('search', JSON.stringify(oldData));
		}

		function view() {
			if (localStorage.getItem('search') != null) {
				$('#savedHistory').empty();
				const searches = JSON.parse(localStorage.getItem('search'));
				for (var i = 0; i < searches.length; i++) {
					// console.log(searches[i]);
					let searchText = searches[i];
					// create new element with text as searches[i]
					console.log("Searchtext", searchText.charAt(0).toUpperCase())
					// append that new element to #savedHistory
					$('#savedHistory').append(
						$('<li>').text(searchText.charAt(0).toUpperCase()+ searchText.substring(1).toLowerCase())
						);
				}
			}
		}
		// console.log(view());
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
				var mainIconURL = `https://openweathermap.org/img/wn/${mainIcon}@2x.png`;
				var iconImgMain = `<img src=${mainIconURL}></img>`;
				var weather = response.main.temp;
				var feelsLike = response.main.feels_like;

				$('#temp')
					.append(`Temperature:${weatherDescription}` + '°F')
					.append(`</br>`);
				$('#wind').append(`Wind Speed:${windSpeed}mph`).append(`<br>`);
				$('#humid').append(`Humidity: ${humidity}%`).append(`<br>`);
				$(`#sideIcon`).append(iconImgMain);

				//Main Card Back

				$('#weatherInfo').html('Current Temperature:  ' + weather + '°F');
				$('#feel').html('Feels like:  ' + feelsLike + '°F');
			}
			info();

			//-----------------------UV Index-------------------------------------------------------//
			function getUV() {
				var lat = response.coord.lat;
				var lon = response.coord.lon;

				$.ajax({
					url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
					method: 'GET',
				}).then(function (response2) {
					var uvIndex = response2.value;

					$('#uvi').append(`UV Index:${uvIndex}`).append(`<br>`);

					if ($(uvIndex) <= 2.99) {
						$(`#uvi`).css('background-color', 'green');
					}
					if (3.0 < $(uvIndex) <= 6.99) {
						$(`#uvi`).css('background-color', 'yellow');
					} 
					if (7 < $(uvIndex) <= 100) {
						$(`#uvi`).css('background-color', 'red');
					} 
					
				});
			}
			getUV();

			//----------------------5 Day Forecast----------------------------------------------------------//
			function fiveDayForecast() {
				$.ajax({
					url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`,
					method: `GET`,
				}).then(function (response3) {
				
				
				
					let dt1= new Date(response3.list[1].dt*1000).toDateString()
					let dt2= new Date(response3.list[8].dt*1000).toDateString()
					let dt3= new Date(response3.list[16].dt*1000).toDateString()
					let dt4= new Date(response3.list[24].dt*1000).toDateString()
					let dt5= new Date(response3.list[30].dt*1000).toDateString()
					let dt6= new Date(response3.list[36].dt*1000).toDateString()
					console.log(dt1, dt2, dt3, dt4, dt5)
					$(`.currentDay1`).empty()
					$(`.currentDay1`).append(dt1)
					//---------------------Retreiving and appending icon to DOM-----------------------------------//
					//Day One Icons
					// let dt= new Date(response3.list[0].dt*1000).toDateString()
					var iconOne = response3.list[0].weather[0].icon;
					var iconURL = `https://openweathermap.org/img/wn/${iconOne}@2x.png`;
					var iconImg1 = `<img src=${iconURL}></img>`;
					$(`#icon1`).append(iconImg1);
					$(`.currentDay2`).empty()
					$(`.currentDay2`).append(dt2)
					// console.log(iconImg1);

					//Day Two Icons
					var iconTwo = response3.list[8].weather[0].icon;
					var iconURL2 = `https://openweathermap.org/img/wn/${iconTwo}@2x.png`;
					var iconImg2 = `<img src=${iconURL2}></img>`;
					$(`#icon2`).append(iconImg2);
					$(`.currentDay3`).empty()
					$(`.currentDay3`).append(dt3)
					// console.log(iconURL2);
					// console.log(iconImg2);

					//Day Three Icons
					var iconThree = response3.list[16].weather[0].icon;
					var iconURL3 = `https://openweathermap.org/img/wn/${iconThree}@2x.png`;
					console.log(iconURL);
					var iconImg3 = `<img src=${iconURL3}></img>`;
					$(`#icon3`).append(iconImg3);
					$(`.currentDay4`).empty()
					$(`.currentDay4`).append(dt4)
					// console.log(iconImg3);

					//Day Four Iccons
					var iconFour = response3.list[24].weather[0].icon;
					var iconURL4 = `https://openweathermap.org/img/wn/${iconFour}@2x.png`;
					console.log(iconURL4);
					var iconImg4 = `<img src=${iconURL4}></img>`;
					$(`#icon4`).append(iconImg4);
					$(`.currentDay5`).empty()
					$(`.currentDay5`).append(dt5)
					

					//Day Five Icons
					var iconFive = response3.list[32].weather[0].icon;
					var iconURL5 = `https://openweathermap.org/img/wn/${iconFive}@2x.png`;
					console.log(iconURL5);
					var iconImg5 = `<img src=${iconURL5}></img>`;
					$(`#icon5`).append(iconImg5);
					// console.log(iconImg5);
					$(`.currentDay6`).empty()
					$(`.currentDay6`).append(dt6)

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
					$(`#dayOne`).append(`Temperature:${dayOneA} F`);
					$(`#dayOneSub`).append(`Humidity: ${dayOneB} %`);
					//Day 2 of 5 day forecast
					$(`#dayTwo`).append(`Temperature: ${dayTwoA} F`);
					$(`#dayTwoSub`).append(`Humidity: ${dayTwoB} %`);
					//Day 3 of 5 day forecast
					$(`#dayThree`).append(`Temperature: ${dayThreeA} F`);
					$(`#dayThreeSub`).append(`Humidity: ${dayThreeB} %`);
					//Day 4 of 5 day forecast
					$(`#dayFour`).append(`Temperature: ${dayFourA} F`);
					$(`#dayFourSub`).append(`Humidity: ${dayFourB} %`);

					$(`#dayFive`).append(`Temperature: ${dayFiveA} F`);
					$(`#dayFiveSub`).append(`Humidity: ${dayFiveB} %`);
				});
			}

			fiveDayForecast();
		});
		save();
		view();
	});
});
