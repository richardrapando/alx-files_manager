import redis from 'redis';
import { promisify } from 'util';

/**
 * Class that performs operations with Redis service
 */
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });

    this.client.on('connect', () => {
       console.log('Redis client connected to the server');
    });
  }

  /**
   * Fuction that checks if connection to Redis is Alive
   * @return - true if connection alive or false if not
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Function that gets value corresponding to key in redis
   * @key - key to search for in redis
   * @return - value of key
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   * Function that creates a new key in redis with a specific TTL
   * @key - key to be saved in redis
   * @value - value to be asigned to key
   * @duration - TTL of key
   * @return -void
   */
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  /**
   * Function that deletes key in redis service
   * @key - key to be deleted
   * @return - void
   */
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
