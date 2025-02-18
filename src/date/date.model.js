import mongoose from "mongoose";

const DateSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Date", DateSchema);

