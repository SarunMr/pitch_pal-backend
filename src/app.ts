import express, { Application } from "express";

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

export default app;
