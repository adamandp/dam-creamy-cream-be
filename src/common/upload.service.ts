import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PinoLogger } from 'nestjs-pino';
import { ErrorMessage } from 'src/utils/message.helper';

@Injectable()
export class UploadService {
  constructor(
    private logger: PinoLogger,
    private config: ConfigService,
  ) {
    this.logger.setContext(UploadService.name);
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME') as string,
      api_key: config.get<string>('CLOUDINARY_API_KEY') as string,
      api_secret: config.get<string>('CLOUDINARY_API_SECRET') as string,
    });
  }
  async uploadImage(
    file: Express.Multer.File,
    name: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: name }, (error, result) => {
          if (error || !result) {
            const message = ErrorMessage.upload(name);
            this.logger.error(message, error);
            reject(new BadRequestException(message));
            return;
          }
          resolve(result);
        })
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      const message = `❌ Failed to delete image "${publicId}" from Cloudinary.`;
      this.logger.error(message, error);
      throw new BadRequestException(message);
    }
  }
}
