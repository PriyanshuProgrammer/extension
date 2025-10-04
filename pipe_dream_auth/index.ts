import express from "express";
import dotenv from "dotenv";
import { getConnectUrl } from "./auth";
import cors from "cors";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json({
		message: "Hello from server",
	});
});

app.post("/connect-url", async (req, res) => {
	const { userId, app } = req.body;
	if (!userId) {
		return res.status(400).json({ error: "User ID is required" });
	}
	const connectUrl = await getConnectUrl(userId, app);
	res.json({ connectUrl });
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
