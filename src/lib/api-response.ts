import { NextResponse } from 'next/server';
import { logger } from './logger';

export class ApiResponse {
  static success(data: any, message: string = 'Success', status: number = 200) {
    logger.info(message, { status });
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static error(message: string, errors?: any, status: number = 400) {
    logger.error(message, { status, errors });
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status }
    );
  }

  static unauthorized(message: string = 'غير مصرح بالوصول') {
    logger.warn(message, { status: 401 });
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 401 }
    );
  }

  static forbidden(message: string = 'ممنوع الوصول') {
    logger.warn(message, { status: 403 });
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 403 }
    );
  }

  static notFound(message: string = 'المورد غير موجود') {
    logger.warn(message, { status: 404 });
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 404 }
    );
  }

  static serverError(message: string = 'حدث خطأ في الخادم') {
    logger.error(message, { status: 500 });
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
