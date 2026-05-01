import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(
      `🔍 ${message} not found. Maybe it teleported to another dimension? 🛸`,
      HttpStatus.NOT_FOUND,
    );
  }
}
