import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { extname } from 'path';
import { catchError } from 'src/utils/catch-error';

@Injectable()
export class ImageValidationPipe {
  private readonly allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.svg',
    '.heic',
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (value) {
        const files = Array.isArray(value) ? value : [value];

        for (const image of files) {
          const file = image.originalname;
          const ext = extname(file).toLowerCase();

          if (!this.allowedExtensions.includes(ext)) {
            throw new BadRequestException(
              `Only allowed files : ${this.allowedExtensions.join(', ')}`,
            );
          }
        }
      }

      return value;
    } catch (error) {
      return catchError(error);
    }
  }
}
