import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    shield({ mode: "LIVE" }), // Protect against common attacks
    detectBot({
      mode: "DRY_RUN", // Log decisions without blocking for debugging
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow search engine bots
        "CHROME", // Allow Chrome browsers
        "FIREFOX", // Allow Firefox browsers
        "SAFARI", // Allow Safari browsers
        "POSTMAN",// Allow Postman for testing
        "SERVER_URL" 
        // Add other categories or specific bots as needed
        // See https://arcjet.com/bot-list
      ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens every 10 seconds
      interval: 10,
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;