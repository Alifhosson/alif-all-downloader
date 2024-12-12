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
    console.error("Failed to load configuration from GitHub. Using default configuration.");
    return { serviceStatus: "on", mainPackage: "nayan", fallbackPackage: "rahad" }; // Default config
  }
};

module.exports.alldown = (url) =>
  new Promise(async (resolve, reject) => {
    try {
      const config = await loadConfig();

      // If the overall service is off
      if (config.serviceStatus === "off") {
        return reject({
          status: false,
          message: config.offMessage || "The service is currently turned off. Contact the developer for any issues.",
        });
      }

      // Determine the main and fallback packages
      const mainPackage = config.mainPackage;
      const fallbackPackage = config.fallbackPackage;

      // Helper to download using a specific package
      const downloadWithPackage = async (packageName) => {
        if (packageName === "nayan") {
          return await nayanDownload(url);
        } else if (packageName === "rahad") {
          return await rahadDownload(url);
        }
        throw new Error("Invalid package name.");
      };

      // Try main package first
      let result;
      try {
        result = await downloadWithPackage(mainPackage);
        return resolve({
          status: true,
          source: mainPackage === "nayan" ? "nayan-video-downloader" : "rahad-all-downloader",
          dev: "ALIF HOSSON",
          devfb: "https://facebook.com/100075421394195",
          devwp: "wa.me/+8801615623399",
          message: "Download successful.",
          data: result.data || result.msg || result,
        });
      } catch (mainError) {
        console.error(`Main package (${mainPackage}) failed. Trying fallback...`);
      }

      // Try fallback package
      try {
        result = await downloadWithPackage(fallbackPackage);
        return resolve({
          status: true,
          source: fallbackPackage === "nayan" ? "nayan-video-downloader" : "rahad-all-downloader",
          dev: "ALIF HOSSON",
          devfb: "https://facebook.com/100075421394195",
          devwp: "wa.me/+8801615623399",
          message: "Download successful.",
          data: result.data || result.msg || result,
        });
      } catch (fallbackError) {
        console.error(`Fallback package (${fallbackPackage}) also failed.`);
        throw new Error("Both main and fallback packages failed.");
      }
    } catch (error) {
      reject({
        status: false,
        message: error.message || "An error occurred. Contact the developer for any issues.",
      });
    }
  });
