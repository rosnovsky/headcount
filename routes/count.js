const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const useragent = require("useragent");
const geoip = require("geoip-lite");

useragent(true);
// const requireLogin = require("../middleware/requireLogin");

const Visitor = mongoose.model("visitor");

module.exports = app => {
	app.get("/api/count", async (req, res) => {
		const address = geoip.pretty(
			(req.headers["x-forwarded-for"] || "").split(",")[0] ||
				req.connection.remoteAddress
		);
		const { country, region, city, ll, zip } = geoip.lookup(address);
		const ua = useragent.parse(req.headers["user-agent"]);

		const visitor = new Visitor({
			timestamp: new Date(),
			ip: address,
			location: {
				coordinates: [ll[1], ll[0]],
				address: `${city}, ${region}, ${country}, ${zip}`
			},
			system: `${ua.os.family} ${ua.os.major}.${ua.os.minor}.${ua.os.patch}`,
			client: ua.family,
			version: ua.major,
			fullHeader: req.headers
		});
		try {
			await visitor.save();
		} catch (err) {
			return res.status(422).send(err);
		}
		console.log(visitor);
		res.send(visitor);
	});
};
