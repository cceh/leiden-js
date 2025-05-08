#!/usr/bin/env node

/**
 * This script serves as the CLI entry point for the transformation service.
 * It starts the API server and handles command-line arguments.
 */

import { program } from "commander";
import { startServer } from "../dist/index.js";
import process from "node:process";

// Define CLI options
program
  .name("leiden-transformation-service")
  .description("Leiden Transformation Service API")
  .version(process.env.npm_package_version || "1.0.0")
  .option("-p, --port <port>", "Port to run the service on", process.env.PORT || "3000")
  .option("-h, --host <host>", "Host to bind the service to", "0.0.0.0")
  .parse(process.argv);

const options = program.opts();
const PORT = parseInt(options.port, 10);
const HOST = options.host;

// Start the server using the exported function
const server = startServer(PORT, HOST);

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});