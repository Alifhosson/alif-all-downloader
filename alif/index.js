const axios = require("axios");
const { alldown: nayanDownload } = require("nayan-video-downloader");
const { alldl: rahadDownload } = require("rahad-all-downloader");

// Replace this with your actual config URL
const CONFIG_URL = "https://raw.githubusercontent.com/Alifhosson/webtxt/refs/heads/main/config.json";

// Function to load configuration from the provided GitHub URL
const loadConfig = async () => {
  try {
    const { data } = await axios.get(CONFIG_URL);
    return data;
  } catch (error) {
    throw new Error("Failed to load configuration from GitHub.");
  }
};

module.exports.alldown = (url) =>
  new Promise(async (resolve, reject) => {
    try {
      const config = await loadConfig();

      // Check if the service is turned off
      if (config.serviceStatus === "off") {
        return reject({
          status: false,
          message: config.offMessage || "The service is currently turned off. Contact the developer for any issues.",
        });
      }

      // Try using the first downloader
      const firstAttempt = await nayanDownload(url).catch(() => null);
      if (firstAttempt) {
        return resolve({
          status: true,
          dev: "ALIF HOSSON",
          devfb: "https://facebook.com/100075421394195",
          devwp: "wa.me/+8801615623399",
          message: "Download successful.",
          data: firstAttempt.data || firstAttempt.msg,
        });
      }

      // Fallback to the second downloader if the first fails
      const secondAttempt = await rahadDownload(url).catch(() => null);
      if (secondAttempt) {
        return resolve({
          status: true,
          dev: "ALIF HOSSON",
          devfb: "https://facebook.com/100075421394195",
          devwp: "wa.me/+8801615623399",
          message: "Download successful.",
          data: secondAttempt,
        });
      }

      // If both downloaders fail, reject the promise
      return reject({
        status: false,
        message: "Both downloaders failed. Contact the developer for any issues.",
      });
    } catch (error) {
      reject({
        status: false,
        message: error.message || "An error occurred. Contact the developer for any issues.",
      });
    }
  });
