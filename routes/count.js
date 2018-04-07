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
		const obj = {
			timestamp: new Date(),
			ip: address,
			location: {
				country,
				region,
				city,
				ll,
				zip
			},
			system: `${ua.os.family} ${ua.os.major}.${ua.os.minor}.${ua.os.patch}`,
			client: ua.family,
			version: ua.major
		};
		console.log(obj);

		const visitor = new Visitor({
			timestamp: obj.timestamp,
			ip: obj.ip,
			location: {
				coordinates: [obj.location.ll[1], obj.location.ll[0]],
				address: `${obj.location.city}, ${obj.location.region}, ${
					obj.location.country
				}, ${obj.location.zip}`
			},
			system: obj.system,
			client: obj.client,
			version: obj.version
		});
		try {
			await visitor.save();
		} catch (err) {
			res.status(422).send(err);
		}
		res.send(obj);
	});
};
