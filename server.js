require("dotenv").config();
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const Document = require("./models/Document");
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://usebin000:${process.env.DB_PASSWORD}@usebin.bqwve2x.mongodb.net/`, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

const code = `Welcome to useBin!

Use the commands int the top right corner
to create a new file to share with others.
`;

app.get("/", (req, res) => {
	res.render("code-display", { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
	res.render("new-file");
});

app.post("/save", async (req, res) => {
	const value = req.body.value;
	try {
		const document = await Document.create({ value });
		res.redirect(`/${document._id}`);
	} catch (error) {
		res.render("new-file", { value });
	}

	console.log(value);
});

app.get("/:id/duplicate", async (req, res) => {
	const id = req.params.id;
	try {
		const document = await Document.findById(id);
		res.render("new-file", { value: document.value });
	} catch (error) {
		res.redirect(`/${id}`);
	}
});

app.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const document = await Document.findById(id);
		res.render("code-display", { code: document.value, id });
	} catch (error) {
		res.redirect("/");
	}
});

app.listen(3000, () => {
	console.log("server is running");
});
