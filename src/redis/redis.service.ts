import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async set(key: string, value: string): Promise<void> {
    try {
      await this.redis.set(key, value);
    } catch {
      return;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return this.redis.get(key);
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value));
    } catch {
      return;
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async sAdd(key: string, member: string): Promise<void> {
    try {
      await this.redis.sadd(key, member);
    } catch {
      return;
    }
  }

  async sRem(key: string, member: string): Promise<void> {
    try {
      await this.redis.srem(key, member);
    } catch {
      return;
    }
  }

  async incrByFloat(key: string, amount: number): Promise<void> {
    try {
      await this.redis.incrbyfloat(key, amount);
    } catch {
      return;
    }
  }
}
