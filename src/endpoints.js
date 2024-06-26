require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const Artist = mongoose.model('Artist', { 
    artistID: String,
    name: String,
    trackName: String,
    preview_URL : String,
    imgAlbu: String,
    tips: Array,    
});

const Artist_Today = mongoose.model('Artist_Today', { 
    artistID: String,
    name: String,
    trackName: String,
    preview_URL : String,
    imgAlbum: String,
    tips: Array,
    todaysDate: String,    
    topTenSongs: Array,
});

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


async function takeArandomArtist(){
    const artists = await Artist.find();
    lenght_artist_list = artists.length;
    getRandomNumber(1, lenght_artist_list);
    random_artist = artists[getRandomNumber(1, lenght_artist_list)]
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    const link = "https://api.deezer.com/artist/"+random_artist['artistID']+"/top?limit=50"
    const response = await fetch(link)
    const data =  await response.json()
    let num = getRandomNumber(1,50)

    const getSongs = async (artist) =>{
        const responseTopSongs = await fetch(`https://api.deezer.com/artist/${artist}/top?limit=10`);
        const dataTopSongs = await responseTopSongs.json();
        const result = dataTopSongs.data;
        const list = result.map((song) => song.title_short);
        return list;
        
    }
    const listSongs = await getSongs(random_artist['artistID'])

      
 



    new_preview = data['data'][num]['preview']
    newTrackName = data['data'][num]['title_short']
    newImgAlbum = data['data'][num]['album']['cover_xl'] 
            
    const artist_today = new Artist_Today({
        artistID: random_artist['artistID'],
        name: random_artist['name'],
        trackName: newTrackName,
        preview_URL: new_preview,
        imgAlbum: newImgAlbum,
        tips: random_artist['tips'],
        todaysDate: formattedDate,
        topTenSongs: listSongs,
        })

    await artist_today.save();

    return random_artist; 
}


app.get('/', async (req,res)=>{
    const artists = await Artist.find();
    res.send(artists);
})


app.post("/post", async (req,res)=>{
    const artist = new Artist({
        artistID: req.body.artistID,
        name: req.body.name,
        trackName: req.body.trackName,
        preview_URL: req.body.preview_URL,
        tips: req.body.tips
    });
    await artist.save();
    return res.send(artist);
})


app.delete("/:id", async(req,res) =>{
    const artist = await Artist.findByIdAndDelete(req.params.id);
    return res.send(artist);
})


app.put('/:id', async (req,res) =>{
    const artist = await Artist.findByIdAndUpdate(req.params.id,{
        artistID: req.body.artistID,
        name: req.body.name,
        preview_URL: req.body.preview_URL,
        tips: req.body.tips
    }, {
        new: true
    })
    return res.send(artist);
})


app.get('/api/todayArtist',async (req,res)=>{
    const artists = await Artist_Today.findOne()
    if (!artists){
        return res.status(404).send("error")
    }

    return res.status(200).send(artists);
})


app.get('/api/allNames', async(req,res)=>{
    const sortedArtists = await Artist.find({},'name').sort({ name: 1 });
    return res.status(200).send(sortedArtists);
})

app.get('/api/lenghtList', async (req,res)=>{
    const artists = await Artist.find();
    lenght_artist_list = artists.length;
    console.log(lenght_artist_list)
    return res.status(200).send("Quantidade de artistas no banco de dados: "+lenght_artist_list)
})

let actual_artist;

app.get('/api/cronJobTodayArtist', async (req,res)=>{
    actual_artist = await takeArandomArtist(); 
    const deleteone = await Artist_Today.deleteOne();
    return res.status(200).send("Novo artista gerado.")
})


module.exports = app;