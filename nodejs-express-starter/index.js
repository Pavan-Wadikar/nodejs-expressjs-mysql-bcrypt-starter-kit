var express = require('express');
var app = express();
var cors = require('cors')
const bcrypt = require('bcrypt');
require('dotenv').config()
// const router=require('express').Router
// const postReq=require('./postRequests')
var bodyParser = require('body-parser');
var mysql = require('mysql');


 exports.dbConn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    });
    
    
  


const connection=dbConn.connect()

const saltRounds=10


// var mysql = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));
// default route
app.get('/', (req, res)=> {
return res.send({ error: true, message: 'hello' })
});

app.use(cors({origin:'*'}))



// post requests

//router.route('/createShop',postReq.createShop)


//Sign Up Post Request
app.post('/createUser', (req,res)=>{
    const ip =  req.connection.remoteAddress;
    console.log(ip);
    console.log(req.connection);
    let {firstName,lastName,email,mobile,password,cPassword}=req.body;
    
    if(password==cPassword){
        const salt=bcrypt.genSaltSync(saltRounds);
        const hash=bcrypt.hashSync(password,salt);
        // console.log(`${hash,username}`);
         dbConn.query('insert into stek_users(fname,lname,email,phone_num,password) values(?,?,?,?,?)',[firstName,lastName,email,mobile,hash],(error, results)=> {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'New user has been created successfully.' })
        })
        
    }
    else{
        res.send("Password and confirm password must be same") 
        
        }

    })


//Sign In Post Request
app.post('/logIn',  (req,res)=>{
    let {email,password}=req.body;
    
         dbConn.query(`select * from suser where email=?`,[email],(error,results)=>{
            if (error) {throw error;}
            
            else{    
                let response={error:false,data:results,message:"logged in successfully"}
                console.log(response.data[0].spassword);
                
                                if(bcrypt.compare(password,response.data[0].spassword).then((result)=>result==true)){
                                 return res.send(response)
                                }
                                else{
                                    return res.send("username or password incorrect")
                                }
               
            }



            
            // else{
            //     res.send("Username or Password Doesnt match")
            // }
        })




})















// set port
app.listen(8000, function () {
console.log('Node app is running on port 8000');
});
module.exports = app;