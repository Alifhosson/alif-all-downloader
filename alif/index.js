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

      // Determine which package(s) are enabled
      const isNayanEnabled = config.nayanStatus !== "disabled";
      const isRahadEnabled = config.rahadStatus !== "disabled";

      // Function to handle download attempts
      const tryDownload = async () => {
        // If both packages are enabled, try Nayan first
        if (isNayanEnabled) {
          try {
            const { data, msg } = await nayanDownload(url);
            return { data: data || msg, source: "nayan-video-downloader" };
          } catch {
            // Ignore Nayan failure and fall back
          }
        }

        // If Rahad is enabled, try it next
        if (isRahadEnabled) {
          try {
            const result = await rahadDownload(url);
            return { data: result, source: "rahad-all-downloader" };
          } catch {
            // Ignore Rahad failure
          }
        }

        // If both fail, throw an error
        throw new Error("Both downloaders failed.");
      };

      // Attempt to download
      const downloadResult = await tryDownload();
      resolve({
        status: true,
        dev: "ALIF HOSSON",
        devfb: "https://facebook.com/100075421394195",
        devwp: "wa.me/+8801615623399",
        message: "Download successful.",
        source: downloadResult.source,
        data: downloadResult.data,
      });
    } catch (error) {
      reject({
        status: false,
        message: error.message || "An error occurred. Contact the developer for any issues.",
      });
    }
  });
