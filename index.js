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
  await server.start(); // Ensure server is started before applying middleware
  server.applyMiddleware({ app, path: "/graphql" });
}

startServer().then(() => {
  const PORT = process.env.PORT || 4000;

  // To test server deployment
  app.get("/", (req, res) => {
    res.json("Server deployed successfully");
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}..`);
  });
});
