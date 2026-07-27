import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { shortUrl, getOriginalUrl } from "./Controllers/url.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "NodeJS_Practice_1",
  })
  .then(() => console.log("MongoDb Connected..!"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Render EJS homepage
app.get('/', (req, res) => {
  res.render("index.ejs", { shortUrl: null });
});

// Shorten URL POST route
app.post('/short', shortUrl);

// Dynamic redirection route
app.get("/:shortCode", getOriginalUrl);

// Run server locally
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 1000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

// Export Express app for Vercel
export default app;