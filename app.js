const axios = require("axios");
const { alldown } = require("nayan-media-downloader");
const { alldl } = require("rahad-media-downloader");

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

// alif-all-download module
module.exports.alifAllDownload = (url) =>
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

      // Validate the URL
      const isValidUrl = (string) => {
        try {
          new URL(string);
          return true;
        } catch {
          return false;
        }
      };

      if (!isValidUrl(url)) {
        return reject({
          status: false,
          message: "The provided URL is not valid. Please check and try again.",
        });
      }

      // Try downloading with nayan-media-downloader
      try {
        const { data, msg } = await alldown(url);
        return resolve({
          status: true,
          source: "nayan-media-downloader",
          dev: "ALIF HOSSON",
          devfb: "https://facebook.com/100075421394195",
          devwp: "wa.me/+8801615623399",
          message: "Download successful using nayan-media-downloader.",
          data: data || msg,
        });
      } catch (nayanError) {
        // Fallback to rahad-media-downloader if the first one fails
        try {
          const result = await alldl(url);
          return resolve({
            status: true,
            source: "rahad-media-downloader",
            dev: "ALIF HOSSON",
            devfb: "https://facebook.com/100075421394195",
            devwp: "wa.me/+8801615623399",
            message: "Download successful using rahad-media-downloader.",
            data: result,
          });
        } catch (rahadError) {
          throw new Error("Both download services failed. Please try again later.");
        }
      }
    } catch (error) {
      reject({
        status: false,
        message: error.message || "An error occurred. Contact the developer for any issues.",
      });
    }
  });
