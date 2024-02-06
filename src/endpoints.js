const express = require("express");
const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;


const app = express();
app.use(express.json())


const Artist = mongoose.model('Artist', { 
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
    lenght_artist_list = artists.length
    getRandomNumber(1, lenght_artist_list)
    random_artist = artists[getRandomNumber(1, lenght_artist_list)]
    console.log(random_artist)
    return random_artist

}



app.get('/', async (req,res)=>{
    const artists = await Artist.find();
    
    res.send(artists)
})

app.post("/post", async (req,res)=>{
    const artist = new Artist({
        artistID: req.body.artistID,
        name: req.body.name,
        preview_URL: req.body.preview_URL,
        tips: req.body.tips
    })
    
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
    return res.send(artist)
})

let actual_artist

const job = new CronJob ('0 0 * * * *', async function todayArtist(){
    actual_artist = await takeArandomArtist()
    return actual_artist
}, null, true, 'America/Los_Angeles'); 


job.start();

app.get('/todayArtist',async (req,res)=>{
    console.log(actual_artist)
    if (!actual_artist){
        return res.status(404).send("error")
    }
    return res.status(200).send(actual_artist)
})


app.get('/allNames', async(req,res)=>{
    const artists = await Artist.find({}, 'name');
    return res.status(200).send(artists)
})

module.exports = app;
