import app from "./app.js";
import db from "./utils/db.js";

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    await db.connect();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

start();
