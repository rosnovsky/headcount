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
				type: Number
			}
		],
		address: {
			type: String
		}
	},
	system: String,
	client: String,
	version: String,
	fullHeader: Object
});

mongoose.model("visitor", visitorSchema);
