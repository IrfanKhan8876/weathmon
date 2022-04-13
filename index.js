require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", function(req, res){
    res.render("index");
})

app.get("/home", function(req, res){
    res.render("index");
})

app.post("/", function(req, res){
    const query = req.body.city;
    var unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid=" + process.env.API_KEY + "&units=" + unit + "";
    
    const options = { month: 'long', day: 'numeric' };
    const date = new Date();
    const myDate = date.toLocaleDateString("en-IN", options);
    

        request(url, function(error, response, body){
            if(response.statusCode = 200){

                try {
                    const weather = JSON.parse(body);
                    const img = weather.weather[0].icon;
                    const temp = weather.main.temp;
                    // var feeling = weather.main.feels_like;
                    const description = weather.weather[0].description;
                    const icon = "https://openweathermap.org/img/wn/"+ img +"@4x.png";
                    res.render("info", {place: query, tempData: temp, desc: description, iconPic: icon, date: myDate});
                } catch (err) {
                    if(err instanceof TypeError == true){
                        res.render("failure");
                    }
                }
            }
            });


});

app.post("/failure", (req ,res) => {
    res.redirect("/");
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/404.html")
});

app.post("/404", (req, res) => {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is up at port:3000");
});