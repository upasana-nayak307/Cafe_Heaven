const BookTable=require("../model/bookTable");
const Notification=require("../model/notification");
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
        const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // 1. Save notification to database so closed tabs don't lose it
        const newNotification = await Notification.create({
        title: "New Reservation",
        message: `${guests} guests booked by ${name} for ${bookingTime}`,
        type: "booking",
        read: false,
        time: currentTime,
        });

        // 2. Emit the saved notification document
        const io = req.app.get("io");
        if(io){
            io.emit("new-booking", newNotification);
        }
        res.status(201).json({
            message:"Message received",
            success:true,
            bookingList
        });
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
            const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            // Save cancellation notification to DB
            const cancelledNotification = await Notification.create({
                title: "Booking Cancelled",
                message: `Booking cancelled for ${updatedUser.name}`,
                type: "cancelled",
                read: false,
                time: currentTime,
            });
            const io = req.app.get("io");
            if (io) {
                io.emit("booking-cancelled", cancelledNotification);
            }
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("FULL ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getUser, postUser, updateUser };