require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());


const Artist = mongoose.model('Artist', { 
    artistID: String,
    name: String,
    preview_URL : String,
    tips: Array,    
});

const Artist_Today = mongoose.model('Artist_Today', { 
    artistID: String,
    name: String,
    preview_URL : String,
    tips: Array,    
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

    const artist_today = new Artist_Today({
        artistID: random_artist['artistID'],
        name: random_artist['name'],
        preview_URL: random_artist['preview_URL'],
        tips: random_artist['tips']
    })
    await artist_today.save();
    return random_artist;
}


async function changePreviewURL(actual_artist){
    const link = "https://itunes.apple.com/lookup?id="+actual_artist['artistID']+"&entity=song";
    const response = await fetch(link);
    const data =  await response.json();
    getRandomNumber(1, 50)
    while (true) {
        dataId = await data['results'][getRandomNumber(1, 50)]['artistId'];
        dataName = await data['results'][getRandomNumber(1, 50)]['artistName'];
        if (dataId == actual_artist['artistID'] && dataName == actual_artist['name']){
            new_preview = data['results'][getRandomNumber(1, 50)]['previewUrl'];
            break;
        }
    }
    mongoose_id_artist = actual_artist['_id']
    const artist = await Artist.findByIdAndUpdate(mongoose_id_artist,{
        preview_URL: new_preview
    })
}


app.get('/', async (req,res)=>{
    const artists = await Artist.find();
    res.send(artists);
})


app.post("/post", async (req,res)=>{
    const artist = new Artist({
        artistID: req.body.artistID,
        name: req.body.name,
        preview_URL: req.body.preview_URL,
        tips: req.body.tips
    });
    
    await artist.save();
    return res.send(artist);
})


app.delete("/:id", async(req,res) =>{
    const artist = await Artist.findByIdAndDelete(req.params.id)
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


app.get('/todayArtist',async (req,res)=>{
    const artists = await Artist_Today.findOne()
    if (!artists){
        return res.status(404).send("error")
    }
    return res.status(200).send(artists);
})


app.get('/allNames', async(req,res)=>{
    const artists = await Artist.find({}, 'name');
    return res.status(200).send(artists);
})


let actual_artist;

app.get('/cronJobTodayArtist', async (req,res)=>{
    actual_artist = await takeArandomArtist();
    const deleteone = await Artist_Today.deleteOne();
    changePreviewURL(actual_artist)
    return res.status(200).send("Novo artista gerado.")
})


module.exports = app;