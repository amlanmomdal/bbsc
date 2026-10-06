import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as streamifier from 'streamifier';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private isConfigured = false;

  constructor() {
    dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
    dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dacdtdpdb';
    const apiKey = process.env.CLOUDINARY_API_KEY || '345744774413855';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'hTm8T5qMOoc-JLgwUddyXtGFslA';
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (cloudinaryUrl || (cloudName && apiKey && apiSecret)) {
      if (cloudinaryUrl) {
        cloudinary.config();
      } else {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true,
        });
      }
      this.isConfigured = true;
      this.logger.log(`⚡ Cloudinary Service initialized successfully (Cloud: ${cloudName || 'CLOUDINARY_URL'})`);
    } else {
      this.logger.warn(`⚠️ Cloudinary credentials (CLOUDINARY_CLOUD_NAME / CLOUDINARY_URL) not found in env. Falling back to local /uploads storage.`);
    }
  }

  async uploadFile(file: any, folder = 'bbsc'): Promise<string> {
    if (!file) {
      return '';
    }

    // If Cloudinary is configured, stream/upload directly to Cloudinary CDN
    if (this.isConfigured) {
      try {
        if (file.buffer) {
          return await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: `bbsc/${folder}`,
                resource_type: 'auto',
              },
              (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                if (error) {
                  this.logger.error('Cloudinary stream upload error:', error);
                  return reject(error);
                }
                resolve(result.secure_url);
              },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          });
        } else if (file.path && fs.existsSync(file.path)) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: `bbsc/${folder}`,
            resource_type: 'auto',
          });
          // Remove temporary file from local disk after uploading to Cloudinary
          try {
            await fs.promises.unlink(file.path);
          } catch (e) {}
          return result.secure_url;
        }
      } catch (err: any) {
        this.logger.error(`Cloudinary upload failed: ${err?.message || err}. Falling back to local file path.`);
      }
    }

    // Fallback if file was stored locally on disk
    if (file.filename) {
      return `/uploads/${folder}/${file.filename}`;
    }

    return '';
  }
}
