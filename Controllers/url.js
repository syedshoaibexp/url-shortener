import { Url } from "../Models/Url.js";
import shortid from "shortid";

export const shortUrl = async (req, res) => {
  try {
    let longUrl = req.body.longUrl;

    if (!longUrl) {
      return res.render("index.ejs", {
        shortUrl: null,
        error: "Please provide a valid URL."
      });
    }

    // Automatically prepends http:// if missing (e.g., "google.com" -> "http://google.com")
    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
      longUrl = `https://${longUrl}`;
    }

    const shortCode = shortid.generate();

    // Dynamically construct host URL (handles localhost and Vercel automatically)
    const host = req.get("host");
    const protocol = req.protocol;
    const shortUrl = `${protocol}://${host}/${shortCode}`;

    // Save to database
    const newUrl = new Url({ shortCode, longUrl });
    await newUrl.save();

    console.log("Short URL saved:", newUrl);

    res.render("index.ejs", { shortUrl });
  } catch (error) {
    console.error("Error generating short URL:", error);
    res.status(500).json({ message: "Server error occurred while shortening URL." });
  }
};

export const getOriginalUrl = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;

    // Find in database
    const originalUrl = await Url.findOne({ shortCode });

    if (originalUrl) {
      return res.redirect(originalUrl.longUrl);
    } else {
      return res.status(404).json({ message: "Invalid shortcode or link expired." });
    }
  } catch (error) {
    console.error("Error retrieving original URL:", error);
    res.status(500).json({ message: "Server error occurred during redirection." });
  }
};