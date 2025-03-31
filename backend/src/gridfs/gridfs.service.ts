import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

@Injectable()
export class GridFsService {
  private bucket: GridFSBucket;

  constructor(@InjectConnection() private readonly connection: Connection) {
    if (!this.connection?.db) {
      throw new Error('Database connection is not established');
    }
    
    this.bucket = new GridFSBucket(this.connection.db, {
      bucketName: 'productImages',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ fileId: ObjectId; filename: string; contentType: string }> {
    const { originalname, buffer, mimetype } = file;
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(originalname, {
        contentType: mimetype || 'application/octet-stream',
      });

      readableStream
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          resolve({
            fileId: uploadStream.id,
            filename: originalname,
            contentType: mimetype || 'application/octet-stream'
          });
        });
    });
  }

  async getFileStream(fileId: string): Promise<Readable> {
    const objectId = new ObjectId(fileId);
    const file = await this.getFileInfo(fileId);
    
    const stream = this.bucket.openDownloadStream(objectId);
    stream.on('error', () => {
      throw new NotFoundException('Error streaming file');
    });

    return stream;
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.bucket.delete(new ObjectId(fileId));
    } catch (err) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }
  }

  async getFileInfo(fileId: string): Promise<{ 
    contentType: string; 
    length: number 
  }> {
    const objectId = new ObjectId(fileId);
    const cursor = this.bucket.find({ _id: objectId });
    const file = await cursor.next();

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return {
      contentType: file.contentType || 'application/octet-stream',
      length: file.length
    };
  }
}