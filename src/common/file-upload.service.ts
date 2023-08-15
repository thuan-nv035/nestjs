// import { Injectable } from '@nestjs/common';
// import { createReadStream } from 'fs';
// import { Dropbox } from 'dropbox';
// import { FileEntity } from './file.entity';
// import { FileRepository } from './file.repository';

// @Injectable()
// export class FileUploadService {
//   constructor(private readonly fileRepository: FileRepository) {}

//   async uploadToDropbox(file: Express.Multer.File): Promise<FileEntity> {
//     const { originalname, buffer } = file;

//     const dropbox = new Dropbox({
//       accessToken: process.env.DROPBOX_ACCESS_TOKEN,
//     });

//     // Upload the file to Dropbox
//     const { result } = await dropbox.filesUpload({
//       path: `/uploads/${originalname}`,
//       contents: buffer,
//     });

//     // Create a new entry in the database for the uploaded file
//     const uploadedFile = await this.fileRepository.create({
//       filename: originalname,
//       path: result.path_display,
//     });

//     // Save the uploaded file entity to the database
//     await this.fileRepository.save(uploadedFile);

//     // Return the uploaded file entity
//     return uploadedFile;
//   }
// }
