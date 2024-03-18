import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import schema from "./schema/schema.js";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

//db connection
connectDB(process.env.MONGO_URL);

const server = new ApolloServer({
  schema: schema,
  playground: true,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}

startServer().then(() => {
  const PORT = process.env.PORT || 4000;

  // Set up custom headers for CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });

  // To test server deployment
  app.get("/", (req, res) => {
    res.json("Server deployed successfully");
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}..`);
  });
});
