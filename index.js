// https://rapidapi.com/traveltables/api/cost-of-living-and-prices

// Import the packages I want to use
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

// Set app to use express, set port to 3000, use bodyParser, set static file path to '/public'
const app = express();
const port = process.env.PORT || 10000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// save all available cities in an array, which will be passed to a dropdown list
let availableCities = [];

// get request for homepage, placeholder content passed
app.get("/", (req, res) => {
    res.render("index.ejs", {
        cities: availableCities.sort()
    })
});

//listens for POST request on "/"
app.post("/", async (req, res) => {
    const config = {
        method: 'GET',
        url: 'https://cost-of-living-and-prices.p.rapidapi.com/prices',
        params: {
          city_name: `${req.body.city}`,
          country_name: 'United Kingdom'
        },
        headers: {
          'X-RapidAPI-Key': 'd387397295msh83232f9cd3771b6p1e2769jsn6c653b130443',
          'X-RapidAPI-Host': 'cost-of-living-and-prices.p.rapidapi.com'
        }
    };
    try {
        const result = await axios.request(config);
        res.render("index.ejs", {
            cities: availableCities.sort(),
            content: result.data
        });
    } catch (error) {
        console.error(error.message);
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs")
});


// set app to listen for port (port defined in "const port = x;")
app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
})

//set up config for axios GET req
//key=d387397295msh83232f9cd3771b6p1e2769jsn6c653b130443, host=cost-of-living-and-prices.p.rapidapi.com
const costOfLivingApiGet = {
    method: 'GET',
    url: 'https://cost-of-living-and-prices.p.rapidapi.com/cities',
    headers: {
      'X-RapidAPI-Key': 'd387397295msh83232f9cd3771b6p1e2769jsn6c653b130443',
      'X-RapidAPI-Host': 'cost-of-living-and-prices.p.rapidapi.com'
    }
};

// gets all available city names within 'united kingdom', then pushes them to an array.
async function getAvailableCities() {
    try {
        const result = await axios.request(costOfLivingApiGet);
        filterCities(result.data.cities);
    } catch (error) {
        console.error(error.message);
    }
};

// takes all results from API response, and pushes the city name of any object with the country "United Kindgom"
function filterCities(array) {
    for (let item of array) {
        if (item.country_name === "United Kingdom") {
            availableCities.push(item.city_name);
        }
    }
    console.log(availableCities);
};

// runs getAvailableCities() on server start
getAvailableCities();
