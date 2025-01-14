import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import { DecodedToken} from "@/types/middleware";
import {IUser} from "@/models/user";

// Constants
export const TOKEN_EXPIRY = 30 * 60; // 30 minutes in seconds
export const GRACE_PERIOD = 2 * 60; // 2 minutes grace period
export const ACTIVITY_CHECK_INTERVAL = 60000; // 1 minute in milliseconds

// Token cache
export const activeTokens = new NodeCache();

interface TokenData {
  token: string;
  expiryTime: number;
  lastActivity: number;
}

export class TokenManager {
  private static instance: TokenManager;
  private tokenStore: Map<string, TokenData>;
  private readonly JWT_SECRET: string;
  private cleanupInterval!: NodeJS.Timeout;

  private constructor() {
    this.startCleanupInterval();
    this.tokenStore = new Map();
    this.JWT_SECRET = process.env.JWT_SECRET || "";
    if (!this.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public generateToken(userId: string, email: string, role: string): string {
    const token = jwt.sign(
      {userId, email, role},
      process.env.JWT_SECRET as string,
      {expiresIn: TOKEN_EXPIRY}
    );

    const tokenData: TokenData = {
      token,
      expiryTime: Date.now() + TOKEN_EXPIRY * 1000,
      lastActivity: Date.now(),
    };

    activeTokens.set(userId, tokenData);
    return token;
  }

  public updateTokenActivity(userId: string): void {
    const tokenData = activeTokens.get<TokenData>(userId);
    if (tokenData) {
      tokenData.lastActivity = Date.now();
      activeTokens.set(userId, tokenData);
    }
  }

  public async refreshToken(
    userId: string,
    user: IUser
  ): Promise<string | null> {
    if (!user) return null;
    return this.generateToken(userId, user.email, user.role);
  }

  public revokeToken(userId: string): void {
    this.tokenStore.delete(userId);
  }

  public verifyToken(token: string): DecodedToken {
    try {
      return jwt.verify(token, this.JWT_SECRET) as DecodedToken;
    } catch (error) {
      throw error;
    }
  }

  public getTokenData(userId: string): TokenData | undefined {
    return this.tokenStore.get(userId);
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      activeTokens.keys().forEach((userId) => {
        const tokenData = activeTokens.get<TokenData>(userId);
        if (!tokenData) return;

        const inactiveTime = now - tokenData.lastActivity;
        if (
          now > tokenData.expiryTime + GRACE_PERIOD * 1000 ||
          inactiveTime > (TOKEN_EXPIRY + GRACE_PERIOD) * 1000
        ) {
          activeTokens.del(userId);
        }
      });
    }, ACTIVITY_CHECK_INTERVAL);
  }

  public stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export const tokenManager = TokenManager.getInstance();