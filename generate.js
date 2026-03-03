const fs = require("fs");
const https = require("https");

const username = process.env.USERNAME;
const token = process.env.TOKEN;

function fetchContributions() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: `/users/${username}/events`,
      headers: {
        "User-Agent": "node",
        Authorization: `token ${token}`
      }
    };

    https.get(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

function generateSVG(count) {
  let svg = `
  <svg width="800" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="120" fill="#0d1117"/>
  `;

  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * count);
    const color = random > 5 ? "#39d353" : "#161b22";

    svg += `<rect x="${i*15}" y="40" width="12" height="12" fill="${color}" rx="2"/>`;
  }

  svg += "</svg>";
  return svg;
}

async function main() {
  const events = await fetchContributions();
  const count = events.length;

  const svg = generateSVG(count);
  fs.writeFileSync("profile-gitblock.svg", svg);
}

main();
