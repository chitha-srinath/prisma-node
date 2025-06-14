import winston, { format, transports } from 'winston';
import Transport from 'winston-transport';
import { PrismaClient } from '@prisma/client';

class PrismaTransport extends Transport {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    super();
    this.prisma = prisma;
  }

  async log(info: winston.Logform.TransformableInfo, callback: () => void) {
    try {
      await this.prisma.log.create({
        data: {
          level: info.level,
          message: String(info.message),
        },
      });
    } catch (error) {
      console.error('Failed to log to database:', error);
    }
    callback();
  }
}

export class LoggerUtility {
  private static instance: LoggerUtility;
  private logger: winston.Logger;

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

  public static getInstance(prisma: PrismaClient): LoggerUtility {
    if (!LoggerUtility.instance) {
      LoggerUtility.instance = new LoggerUtility(prisma);
    }
    return LoggerUtility.instance;
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
