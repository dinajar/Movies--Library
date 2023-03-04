`use strict`

const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
server.use(cors());
const pg = require('pg');
//const path = require('path');
const getJson = require('./data.json');
const client = new pg.Client(process.env.DatabaseURL);
const PORT = 3000;



server.use(express.json());
server.post('/addMovie', addMovieHandler);
server.get('/getMovies', getMoviesHandler);





const conData1 = new conData(getJson.title, getJson.poster_path, getJson.overview);

server.get('/', (req, res) => {
    res.send(conData1);
})


server.get('/favorite', (req, res) => {
    console.log("Welcome to Favorite Page");
})

server.put('/update/:id', updateMovieHandler)
server.delete('/delete/:id', DELETEHandler)


function conData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    return (this.title);
}



function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = 'INSERT INTO movies(movieName,comments) VALUES($1,$2) RETURNING * ';
    const values = [movie.movieName, movie.comments];
    console.log(movie);
    client.query(sql,values)
    .then((data) => {
        res.send('data was added');
    })
    .catch(error => {
        res.send('error00');
    });
}


function getMoviesHandler(req,res){
    const sql = 'SELECT * FROM movies';
    client.query(sql)
    .then((data) => {
        res.send(data.rows);
    })
    .catch(error => {
        res.send('error');
    });
}

function updateMovieHandler(req,res){
    const id = req.params.id;
    const movie = req.body;
    console.log(id);
    console.log(req.body);
    const sql = 'UPDATE movies  SET movieName=$1,comments =$2  WHERE id =${id}  RETURNING * ';
    const values = [movie.movieName, movie.comments];

    client.query(sql,values)
    .then((data) => {
        res.send(data.rows);
    })
    .catch(error => {
        res.send('error00');
    });

}

function DELETEHandler(req,res){
    const id = req.params.id;
    const sql = `DELETE FROM movies WHERE id = ${id}`;
    client.query(sql)
    .then((data) => {
        res.json({});
    })
    .catch(error => {
        res.send('error00');
    });
}

function handleError(req, res, par3) {
    return (`{ 
        "status": 404,
        "responseText": "page not found error" 
    }`);
}

client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`running on port ${PORT}`);
    });
})
.catch(error => {
    res.send('error')
});



