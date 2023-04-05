var express = require("express")
var bodyParser = require("body-parser")
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
var jsonParser = bodyParser.json();
var mongoose = require("mongoose")
const User = require('./models/user')
const cors = require('cors');

// https://github.com/Vasanth-Korada/SignUpForm-HTML_NodeJS_MongoDB/blob/main/index.js
const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb+srv://rishabh:te?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))
// weldone
app.get("/table", (req, res) => {
    db.collection('details').find({}).toArray((err, result) => {
        if (err) throw err
        results = result
        console.log(results)
        res.send(results[1].name)
    })
});
// app.get("/getAll", async (req, res) => {
//     console.log(req)
//     db.collection('details').find({}).toArray((err,result)=>{
//         if(err)throw err 
//         results=result

//         console.log("getall")
//         res.send(results)
//     })
// });
// app.post("/getAll", async (req, res) => {
//     a = req.body.da;
//     console.log(a)
//     var myobj = { StudentName: req.body.da };
//     db.collection('details').findOne(myobj, function (err, results) {
//         if (err) throw err;

//         console.log(results); res.send(results)
//     })
// });

app.post("/loginA", async function (req, res) {
    // try {
    console.log("lo")
    // check if the user exists
    const rea = req.body
    const user = await db.collection('details').findOne({ email: req.body.email });
    if (user != null) {
        // token
        let re = "";
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        jwt.sign({ rea }, jwtSecretKey, { expiresIn: '3000s' }, (err, token) => {
            // res.json({ token })


            // console.log("lo", user)
            //check if password matches
            const result = req.body.password === user.password;
            if (result) {
                console.log("lo", user, token);
                res.json({ token })
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        });
    }
    else {
        res.status(400).json({ error: "User doesn't exist" });
    }


    // } catch (error) {
    //     res.status(400).json({ error });
    // }
})

app.post("/signup", async function (req, res) {
    // check if the user exists
    var data1 = { "id": "dashboard", "StudentSection": ["Home", "Profile", "status", "Contact"], "EmplyeeSection": ["Home", "Profile", "JobStatus", "Contact"] };

    console.log(req.body);
    const user = await db.collection('details').findOne({ email: req.body.email });
    const mobile = await db.collection('details').findOne({ mobile: req.body.lastname });
    console.log(user, mobile);
    if (user == null && mobile == null) {
        var name = req.body.name;
        var email = req.body.email;
        var pass = req.body.password;
        var phone = req.body.phone;

        var data = {
            "name": name,
            "email": email,
            "password": pass,
            "phone": phone
        }
        var data1 = { "id": "dashboard", "StudentSection": ["Home", "Profile", "status", "Contact"], "EmplyeeSection": ["Home", "Profile", "JobStatus", "Contact"] };
        db.collection('details').insertOne(data, function (err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully", collection);
            res.send(collection);

        });
    }


})
app.post("/update", async (req, res) => {
    // console.log(req.body.name)
    // console.log(req.body.age)
    // var myobj = { name:req.body.name , address: req.body.newAge };
    var query = { studentCode: req.body.studentCode };
    var badlo = { $set: { name: req.body.name, age: req.body.age, email: req.body.email, mobile: req.body.mobile } }
    db.collection("details").updateMany(query, badlo, function (err, result) {
        if (err) throw err;
        console.log("update");;
        // db.close();
    });

});

app.post("/post", async (req, res) => {
    // console.log(req.body.name)
    // console.log(req.body.age)
    var myobj = {
        name: req.body.name, age: req.body.age, email: req.body.email, mobile: req.body.mobile, studentCode: req.body.studentCode, createdAt: new Date(),
        updatedAt: new Date()
    };
    db.collection("details").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted hah");

    })
});
app.post("/delete", async (req, res) => {
    // console.log(req.body.name)
    console.log(req.body.studentCode)
    var r = req.body.studentCode

    var myobj = { studentCode: r };
    // var myobj={name:"rishabh"};
    db.collection("details").deleteOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document deletedd hah");

    })
});
// app.post("/sign_up",(req,res)=>{
//     var name = req.body.name;
//     var email = req.body.email;
//     var phno = req.body.phno;
//     var ta = req.body.ta;
//     var password = req.body.password;

//     var data = {
//         "name": name,
//         "email" : email,
//         "phone": phno,
//         "ta":ta,
//         "password" : password
//     }

//     db.collection('details').insertOne(data,(err,collection)=>{
//         if(err){
//             throw err;
//         }
//         console.log("Record Inserted Successfully");
//     });

//     return res.redirect('signup_success.html')

// })


// app.get("/",(req,res)=>{
//     res.set({
//         "Allow-access-Allow-Origin": '*'
//     })
//     return res.redirect('index.html');
// }).listen(3000);




// app.post("/register", function (req, res) {
//     var name = req.body.name
//     var password = req.body.password

//     db.collection('details').findOne({email:email});
//     if(u.password===password){
//         res.redirect('signup_success.html');
//     }
// });
app.post("/register", function (req, res) {
    console.log("fsfs")
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        username: "risabh",
        time: Date(),
        userId: 12,
    }
    // console.log("fail")

    jwt.sign({ data }, jwtSecretKey, { expiresIn: '3000s' }, (err, token) => {
        res.json({ token })
    });

    // res.send({ token });
    // console.log(token)
})

app.get("/user/validateToken", async (req, res) => {
    // Tokens are generally passed in the header of the request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header("Authorization");

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});
app.post("/profile1", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if (err) { res.send({ result: "invalid token" }) }
        else {
            const student = await db.collection('details').findOne({ "StudentName": "aks" });
            res.json(student);
        }
    })
})
app.post("/postEmplyees", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if (err) { res.send({ result: "invalid token" }) }
        else {
            console.log(req.body);
            db.collection('EmployeeAng').insertOne(req.body, function (err, collection) {
                if (err) throw err;
                console.log("Record inserted Successfully", collection);
                d = [collection]
                res.json(collection);

            });
            //const student = await db.collection('details').findOne({ "StudentName": "aks" });
            //res.json(student);
        }
    })
})
app.get("/postEmplyees", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if (err) { res.send({ result: "invalid token" }) }
        else {
            console.log(req.body);
            db.collection('EmployeeAng').find({}).toArray(function (err, collection) {
                if (err) throw err;
                console.log("fetched Successfully", collection);
                res.json(collection);

            });

        }
    })
})

app.post("/profile", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {

        if (err) {
            console.log("fail")
            res.send({ result: "invalid token" })
        }

        else {
            // const bashboard = await db.collection('details').findOne({ "id": "dashboard" });

            // User.find().then((result) => {
            //     console.log("pass")
            //     data = [result, bashboard]
            //     res.status(200).json(data)
            // })
            res.send({ result: true });
            // res.send({
            //     result: "valid"
            // })
        }
    })
})
async function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token; console.log("fail")
        next();
    } else {
        res.send({ result: "token  gaf invalid" })
    }

}


app.listen(3000);
console.log("Listening on PORT 3000");
