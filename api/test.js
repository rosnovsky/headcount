const fetch = require('node-fetch');

module.exports = (req, res) => {
    const timestamp = new Date().toLocaleString("en-US", {timeZone: "America/Vancouver"});
    const date = new Date(timestamp).toLocaleDateString("en-US");

    const avatar = fetch('https://api.github.com/users/rosnovsky')
        .then(data => data.json())
        .then(data => {
            const avatarUrl = data.avatar_url;
            const hireable  = data.hireable;
            const followers = data.followers;
            const githubData = { avatarUrl, hireable, followers };
            return githubData;
        })
        .then(githubData => {
            const client = req.headers["user-agent"];
            const ip = req.headers["x-real-ip"];
            const location = fetch(`http://ip-api.com/json/${ip}`)
                .then(data => data.json())
                .then(data => {
                    if(data.status !== "fail"){
                        return data}
                    return false})
                .then(geoData => 
                    res.json({ "Today": date, "Github": githubData, "client": client, "ip": ip, "GeoData": geoData })
                )
        }
    );
}