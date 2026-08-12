const mongoose=require("mongoose");
require("dotenv").config();
const API=process.env.MONGO_URL;
async function main() {
    await mongoose.connect(`${API}/CafeHeaven`);
}
main().then(()=>{
    console.log("Database is connected");
})
.catch(()=>{
    console.log("Database is not connected");
})