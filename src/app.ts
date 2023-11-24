import express from "express";
import bodyParser from "body-parser";
import { routes } from "./routes";
// Have only used bacis here but we can add more middlewares and security levels as per requirements. also cors.

// Also have shared the postman collection in the postman-collection folder.
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
