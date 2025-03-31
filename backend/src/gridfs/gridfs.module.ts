import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GridFsService } from './gridfs.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connected for GridFS');
          });
          return connection;
        },
      }),
    }),
  ],
  providers: [GridFsService],
  exports: [GridFsService],
})
export class GridFsModule {}