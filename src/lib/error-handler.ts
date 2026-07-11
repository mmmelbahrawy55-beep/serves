import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'خطأ في التحقق من البيانات') {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'المورد غير موجود') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'غير مصرح بالوصول') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'ممنوع الوصول') {
    super(message, 403);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    logger.error(error.message, { statusCode: error.statusCode });
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    logger.error(error.message, { stack: error.stack });
    return {
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'حدث خطأ في الخادم' 
        : error.message,
      statusCode: 500,
    };
  }

  logger.error('Unknown error occurred', { error });
  return {
    success: false,
    message: 'حدث خطأ غير متوقع',
    statusCode: 500,
  };
}
