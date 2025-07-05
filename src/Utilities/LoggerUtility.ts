import winston, { format, transports } from 'winston';
import Transport from 'winston-transport';
import { PrismaClient } from '@prisma/client';

/**
 * Custom Winston transport for logging to Prisma database.
 * Stores log entries in the database for persistence and querying.
 */
class PrismaTransport extends Transport {
  private prisma: PrismaClient;

  /**
   * Initializes the Prisma transport with a database connection.
   * @param prisma Prisma client instance for database operations
   */
  constructor(prisma: PrismaClient) {
    super();
    this.prisma = prisma;
  }

  /**
   * Logs a message to the database using Prisma.
   * @param info Winston log information object
   * @param callback Callback function to signal completion
   */
  async log(info: winston.Logform.TransformableInfo, callback: () => void): Promise<void> {
    try {
      await this.prisma.log.create({
        data: {
          level: info.level,
          message: String(info.message),
        },
      });
    } catch (error) {
      // Use process.stderr for critical logging failures to avoid infinite loops
      process.stderr.write(
        `Failed to log to database: ${error instanceof Error ? error.message : 'Unknown error'}\n`,
      );
    }
    callback();
  }
}

/**
 * Singleton logger utility that provides centralized logging functionality.
 * Supports console, file, and database logging with configurable levels.
 */
export class LoggerUtility {
  private static instance: LoggerUtility;
  private logger: winston.Logger;

  /**
   * Private constructor to enforce singleton pattern.
   * Initializes Winston logger with multiple transports.
   * @param prisma Prisma client instance for database logging
   */
  private constructor(prisma: PrismaClient) {
    this.logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new PrismaTransport(prisma),
      ],
    });
  }

  /**
   * Gets the singleton instance of LoggerUtility.
   * Creates a new instance if one doesn't exist.
   * @param prisma Prisma client instance for database logging
   * @returns LoggerUtility singleton instance
   */
  public static getInstance(prisma: PrismaClient): LoggerUtility {
    if (!LoggerUtility.instance) {
      LoggerUtility.instance = new LoggerUtility(prisma);
    }
    return LoggerUtility.instance;
  }

  /**
   * Logs an informational message.
   * @param message The message to log
   */
  info(message: string): void {
    this.logger.info(message);
  }

  /**
   * Logs an error message.
   * @param message The error message to log
   */
  error(message: string): void {
    this.logger.error(message);
  }

  /**
   * Logs a warning message.
   * @param message The warning message to log
   */
  warn(message: string): void {
    this.logger.warn(message);
  }

  /**
   * Logs a debug message.
   * @param message The debug message to log
   */
  debug(message: string): void {
    this.logger.debug(message);
  }
}
