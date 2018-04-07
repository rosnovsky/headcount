const mongoose = require("mongoose");
const { Schema } = mongoose;

const visitorSchema = new Schema({
	timestamp: Date,
	ip: String,
	location: {
		type: {
			type: String,
			default: "Point"
		},
		coordinates: [
			{
				type: Number,
				required: "You must supply coordinates"
			}
		],
		address: {
			type: String,
			required: "Address is required."
		}
	},
	system: String,
	client: String,
	version: String
});

mongoose.model("visitor", visitorSchema);
