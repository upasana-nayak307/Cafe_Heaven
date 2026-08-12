const mongoose=require("mongoose");
require("dotenv").config();
const API=process.env.MONGO_URL;
async function main() {
    await mongoose.connect(API);
}
main().then(()=>{
    console.log("Database is connected");
})
.catch((error)=>{
    console.log("Database is not connected");
    console.log(error);
})