import Redis from "ioredis";

// Create Redis client
export const redis = new Redis(process.env.REDIS_HOST || "redis://default:mVLTKx5ScBUFl3iK5DghTTjFfKYjzcba@redis-15508.c341.af-south-1-1.ec2.redns.redis-cloud.com:15508");

console.log("Connecting to the Redis"); 
  
redis.on("ready", () => { 
    console.log("redis Connected!"); 
});

// listening for errors
redis.on("error", (error) => {
    console.error('redis',`redis ${error.message}`);
});