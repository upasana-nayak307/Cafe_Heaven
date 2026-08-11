const mongoose=require("mongoose");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/CafeHeaven");
}
main().then(()=>{
    console.log("Database is connected");
})
.catch(()=>{
    console.log("Database is not connected");
})

