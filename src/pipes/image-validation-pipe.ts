import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { extname } from "path";
import { catchError } from "src/utils/catch-error";

@Injectable()
export class ImageValidationPipe implements PipeTransform {
    private readonly allowedExtensions = [
        '.jpeg',
        '.jpg',
        '.png',
        '.svg',
        '.heic',
        '.webp'
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        try {
            if(value) {
                const file = value.originalname;
                const ext = extname(file).toLowerCase();
                if(!this.allowedExtensions.includes(file)){
                    throw new BadRequestException('Not allowed file!');
                }
            }
            return value;
        } catch (error) {
            return catchError(error)
        }
    }
}