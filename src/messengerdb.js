const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbJack:oroXINBEBT8uLFdk@messengerdb.heiib.mongodb.net/boop?retryWrites=true&w=majority";
const mongodbclient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db = null;
mongodbclient.connect( (err,connection) => {
    if(err) throw err;
    console.log("Connected to the MongoDB cluster!");
    db = connection.db();
})
const dbIsReady = ()=>{
    return db != null;
};
const getDb = () =>{
    if(!dbIsReady())
        throw Error("No database connection");
    return db;
}
function validateUsername(username){
    return (username && username.length > 4);
}
function validatePassword(password){
    //a validation requiring the password must be 6 chars or longer
    //must contain at least one digit, one lower case, and one UPPERCASE
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password); 
}
const  checklogin = async (username,password)=>{
    //your implementation
    if(validatePassword(password)&&validateUsername(username)){
        var users = getDb().collection("users");
        var user = await users.findOne({username:username,password:password});
        if (user!=null && user.username==username){
            console.log("Debug>messengerdb.checklogin-> user found:\n" +
            JSON.stringify(user))
            return true
        }
        else {
            return false
    }
}
}

const addUser = async (username,password)=>{
    //your implementation
    if(validatePassword(password)&&validateUsername(username)){
        var users = getDb().collection("users");
        var user = await users.findOne({username:username});
        if (user!=null && user.username==username){
            console.log(`Debug>messengerdb.addUser: Username '${username}' exists!`);
            return "UserExist";
        }
        else {
            const newUser = {"username": username,"password" : password}
            try{
                const result = await users.insertOne(newUser);
                if(result!=null){
                    console.log("Debug>messengerdb.addUser: a new user added: \n", result);
                    return "Success";
                }
            }catch{
                console.log("Debug>messengerdb.addUser: error for adding '" +
                username +"':\n", err);
                return "Error";
            }
    }
}
}

module.exports = {checklogin,addUser};