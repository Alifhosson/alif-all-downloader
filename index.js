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

      // Attempt to process the URL using nayan-video-downloader first
      try {
        const { data, msg } = await nayanDownload(url);
        return resolve({
          status: true,
          dev: "ALIF HOSSON",
          devfb: "https://facebook.com/100075421394195",
          devwp: "wa.me/+8801615623399",
          message: "Downloaded successfully using nayan-video-downloader.",
          data: data || msg,
        });
      } catch (nayanError) {
        console.error("nayan-video-downloader failed, trying rahad-all-downloader...", nayanError.message);

        // Fallback to rahad-all-downloader
        try {
          const result = await rahadDownload(url);
          return resolve({
            status: true,
            dev: "ALIF HOSSON",
            devfb: "https://facebook.com/100075421394195",
            devwp: "wa.me/+8801615623399",
            message: "Downloaded successfully using rahad-all-downloader.",
            data: result,
          });
        } catch (rahadError) {
          console.error("rahad-all-downloader failed...", rahadError.message);
          return reject({
            status: false,
            message: "Both nayan-video-downloader and rahad-all-downloader failed. Please try again later.",
          });
        }
      }
    } catch (error) {
      reject({
        status: false,
        message: error.message || "An error occurred. Contact the developer for any issues.",
      });
    }
  });
