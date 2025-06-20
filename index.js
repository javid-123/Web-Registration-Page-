const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const cors = require('cors')

const TEMP = require('./model/student')

app.use(express.json())
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/collageDB')
    .then(() => console.log('success'))
    .catch((err) => console.log('not sucess', err))

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/insert', async (req, res) => {
    const { email } = req.body;

    try {
        // 🔍 Check if email already exists
        const existingUser = await TEMP.findOne({ email });

        if (existingUser) {

            return res.status(400).json({ message: "This email is already registered" });

        }

        // ✅ If not exists, save new user
        const inputdata = new TEMP(req.body);
        const result = await inputdata.save();
        res.status(201).json({ message: "Record added successfully", result });

    } catch (error) {
        console.error("Insert error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/emp/:email', async (req, res) => {
    let email = req.params.email;

    let mydata = await TEMP.findOne({ email: email });

    if (mydata) {
        res.json(mydata);
    } else {
        res.status(404).json({ message: "No record found" });
    }
});

app.put('/update/:email', async (req, res) => {

   const { email } = req.body;

   try{ // 🔍 Check if email not exists
    const existingUser = await TEMP.findOne({ email });

    if (!existingUser) {

        return res.status(400).json({ message: "This email is not registered" });

    }
    let myemail = req.params.email;
    let myupdate = await TEMP.findOneAndUpdate({email: myemail},req.body, {new:true});
    res.json({message:"record updated",
                updatedData:myupdate

    })
}catch(error){
    console.error("Update error",error);
    res.status(404).json({message: "server error"})
}

})

app.delete('/delete/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const existingUser = await TEMP.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "This email is not registered" });
        }

        const deletedUser = await TEMP.findOneAndDelete({ email });

        res.json({
            message: "Deleted successfully",
            deletedData: deletedUser
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Server error during deletion" });
    }
});




app.listen(2000, () => { console.log('http://localhost:2000') })