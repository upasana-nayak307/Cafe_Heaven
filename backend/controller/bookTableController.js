const BookTable=require("../model/bookTable");

// for get
const getUser=async (req,res) => {
    try {
        const bookingLists=await BookTable.find();
        res.status(201).json(bookingLists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// for post

const emailRegex = /\S+@\S+\.\S+/;
const indianPhoneRegex = /^(?:(?:\+|00)91[\s-]*)?[6-9]\d{9}$/;
const postUser=async (req,res) => {
    try {
        console.log(req.body);
        const {name,email,phoneNumber,bookingDate,bookingTime,guests}=req.body;
        const existingUser=await BookTable.findOne({phoneNumber,bookingDate,bookingTime});
        if(existingUser){
            return res.status(400).json({
            errors: {
                bookingTime:"You already booked for this time. Try another time slot."
            }
        });
        }
        let errors={};
        if(!name){
            errors.name="Name is required";
        }
        if(!email){
            errors.email="Email is required";
        }
        else if(!emailRegex.test(email)){
            errors.email="Please enter a valid email address";
        }
        if(!phoneNumber){
            errors.phoneNumber="Number is required";
        }
        else if(!indianPhoneRegex.test(phoneNumber)){
            errors.phoneNumber="Please enter a valid 10-digit mobile number";
        }
        if(!bookingDate){
            errors.bookingDate="Select the date";
        }
        if(!bookingTime){
            errors.bookingTime="Select the time";
        }
        if(!guests){
            errors.guests="Select no of guests";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        const bookingList=await BookTable.create({
            name,
            email,
            phoneNumber,
            bookingDate,
            bookingTime,
            guests
        });
        const io = req.app.get("io");
        io.emit("new-booking", bookingList);
        res.status(201).json({
            message:"Message received",
            success:true,
            bookingList
        })
    } catch (err) {
        console.log("FULL ERROR:",err);
        res.status(500).json({ error: err.message });
    }
}

// for update
const updateUser = async (req, res) => {
    try {
        const updatedUser = await BookTable.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (req.body.status === "cancelled") {
            const io = req.app.get("io");

            io.emit("booking-cancelled", {
                message: `Booking cancelled for ${updatedUser.name}`,
                type: "cancelled"
            });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("FULL ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getUser, postUser, updateUser };