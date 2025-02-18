import { Schema, model } from "mongoose";

const PetSchema = new Schema({
    name: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    },
    age: {
        type: Number,
        required: true,
        min: 0          
    },
    type: {
        type: String,
        required: true, 
        uppercase: true,  
        enum: ['PERRO', 'GATO', 'OTRO'],  
    },
    keeper: {
        type: Schema.Types.ObjectId,
        ref: "User",     
        required: true,  
    },
    status: {
        type: Boolean,
        default: true, 
    }
}, {
    timestamps: true,  
    versionKey: false   
});

export default model("Pet", PetSchema);
