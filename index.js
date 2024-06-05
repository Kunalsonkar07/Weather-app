
const usertab = document.querySelector('[data-userweather]');
const searchtab = document.querySelector('[data-searchweather]') ;

const searchform = document.querySelector("[data-searchform]");
const grantaccess = document.querySelector("[data-grant-location]");
const error = document.querySelector('[data-erroroutput]');
const loading = document.querySelector("[loading-container]");
const userinfocontainer = document.querySelector("[user-info-container]");

let currenttab = usertab ;
currenttab.classList.add("current-tab");
swicthtab(usertab);
// getfromsessionstorage();
const APIkey = "bd5e378503939ddaee76f12ad7a97608";


const grantbtn = document.querySelector("[data-grantAccess]");


function showposition(position){
    const userCoordinates = {
        lat: position.coords.latitude ,
        lon: position.coords.longitude ,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    grantaccess.classList.remove("active");
    fetchuserweather(userCoordinates);
}

function getlocation (){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        //show alert 
        alert("unable to take response please try again later");
    }
}

grantbtn.addEventListener("click" , getlocation);

function getfromsessionstorage(){
    let localcoordinate = sessionStorage.getItem("user-coordinates");

    if (!localcoordinate)
        grantaccess.classList.add("active");
    else{
        let coordinates = JSON.parse(localcoordinate);
        fetchuserweather(coordinates);
    }
}

async function fetchuserweather(coordinates){
    const {lat , lon } = coordinates ;
    // grantaccess.classList.add("active"); kyu ?
    loading.classList.add("active");
    // console.log(lat);
    // console.log(lon);
   try{
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`);
        let data = await result.json();
        loading.classList.remove("active");
        // console.log("api call accessed");
        // console.log(data.name);
        userinfocontainer.classList.add("active");
        // console.log("hii");
        renderweather(data);
        // console.log("render");
    }
    catch(e){
        loading.classList.remove("active");
        // hw 
        alert("unable to take response please try again later");
    }
}

function renderweather(weatherinfo){

    // console.log("we are inside");
    const cityname = document.querySelector("[data-cityName]");
    cityname.innerText  = weatherinfo?.name ;
  
    const countryIcon = document.querySelector("[data-countryIcon]");
    countryIcon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;

    const desc = document.querySelector("[data-weatherDesc]");
    desc.innerText = weatherinfo?.weather?.[0]?.description;
    
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;

    const temp = document.querySelector("[data-temp]");
    const kelvin = weatherinfo?.main?.temp ;
    temp.innerText = `${ (kelvin - 273 ).toFixed(2)} °C`;

    const windspeed = document.querySelector("[data-windspeed]");
    windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;

    const humidity = document.querySelector("[data-humidity]");
    humidity.innerText = `${weatherinfo?.main?.humidity}%`;
    
    const cloudiness = document.querySelector("[data-cloudiness]");
    cloudiness.innerText = `${weatherinfo?.clouds?.all}%`;
    
    // console.log(weather.name);
    
    
    // weatherIcon
}

function swicthtab ( clicked ){
    if ( clicked != currenttab){
        currenttab.classList.remove("current-tab");
        currenttab = clicked ;
        currenttab.classList.add("current-tab");
    }

    if (searchtab.classList.contains("current-tab")){
        userinfocontainer.classList.remove("active");
        grantaccess.classList.remove("active");
        error.classList.remove("active");
        searchform.classList.add("active");
    }
    else{
        searchform.classList.remove("active");
        error.classList.remove("active");
        userinfocontainer.classList.remove("active");
        getfromsessionstorage();
    }
}

usertab.addEventListener("click" , () => {
    swicthtab(usertab);
})

searchtab.addEventListener("click" , () => {
    swicthtab(searchtab);
})


const inputsearch = document.querySelector("[data-inputsearch]");
const sumbitbtn = document.querySelector("[data-submitbtn]");

searchform.addEventListener( "submit" , (e) => {
    e.preventDefault();
    // 
    let cityname = inputsearch.value ;

    if ( cityname === "")
        // === nahi lagaya tha = layagaya tha
        return ;
    
    else{
        fetchcityweatherinfo(cityname);
        // console.log(cityname);
    }
})


async function fetchcityweatherinfo(cityname){
    loading.classList.add("active");
    userinfocontainer.classList.remove("active");
    error.classList.remove("active");
    grantaccess.classList.remove("active");
     
    try {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`);
        
        if (!result.ok) {
            // throw new Error(`HTTP error! status: ${result.status}`);
            // alert('kunal');
            loading.classList.remove("active");
            error.classList.add("active");
        } 
        else{
            const data = await result.json();
            loading.classList.remove("active"); 
            userinfocontainer.classList.add("active");
            // alert("return");
            renderweather(data);
        }     
    }
    catch(err){
        alert("unable to take response please try again later");
    }
}



