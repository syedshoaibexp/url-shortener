import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { shortUrl, getOriginalUrl } from "./Controllers/url.js";

dotenv.config();

// Fix directory path resolution for ES Modules on Serverless (Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up EJS view engine & explicit views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using environment variable or fallback
const mongoURI = process.env.MONGO_URI || "mongodb+srv://syedshoaibexp_db_user:shoaib@cluster0.sjrswpy.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, {
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
const port = process.env.PORT || 1000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

// Export Express app for Vercel
export default app;