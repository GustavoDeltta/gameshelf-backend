const axios = require("axios");

async function getGameName(appId) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=en`;
    const response = await axios.get(url);

    if (
      !response.data ||
      !response.data[appId] ||
      !response.data[appId].success
    ) {
      return null;
    }

    const data = response.data[appId].data;
    return data.name;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = { getGameName };
