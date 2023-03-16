import ApiError from "../error/ApiError";
import * as fs from 'fs';
import path from 'path';
import * as uuid from 'uuid';
import { UploadedFile } from "express-fileupload";
import logger from "./logger";

class ImagesManager {
    static removeFile(fileName: string, filePath: string) {
        logger.info('remove file', [fileName, filePath]);
        fileName = fileName.replace('%0:', '');
        fs.unlink(path.join(process.env.static, filePath, fileName), (err) => {
            if (err) {
                logger.error('remove error', [err]);
            }
        });
    }
    /*
        param filePath will be added to static dir
        allowedExtensions filter incoming files by file allowedExtensions
        maxFileSize filter incoming file by size
    */
    filePath: string = '';
    static allowedExtensions: string[] = ['jpg', 'png'];
    static maxFileSize: number = 5200000;
    result: string = '';
    private action: Function;

    constructor(filePath: string | null = null) {
        filePath && (this.filePath = filePath);
    }

    async saveFiles(files: UploadedFile[]) {
        logger.info('save files');
        //needed to run promise all
        let writeAll = [];
        //If only one image is sent, here i get an object instead of an array(a single image is not good at all)
        if (!files.length) {
            throw ApiError.badRequest('Files not found');
        }

        //Files validation
        for (let i = 0; i < files.length; i++) {
            let extension = files[i].name.split('.').pop();

            if (!ImagesManager.allowedExtensions.includes(extension)) {
                throw ApiError.validationError(`File extension is not valid "${extension}"`);
            }
            if (files[i].size > ImagesManager.maxFileSize)//5200000 5mb
            {
                throw ApiError.validationError('File is too big');
            }
            let newFileName = uuid.v4() + '.' + extension;
            this.result += '%0:' + newFileName + ';';

            //we get an array of files, if we start saving them now and some of the subsequent ones are invalid, 
            //then we will have to delete all those already saved, so we save all save functions in array, and if all files correct just call all
            writeAll.push(() => files[i].mv(path.join(process.env.static, this.filePath, newFileName)));
        }

        await Promise.all(writeAll.map(fn => fn()));

        return this.result;
    }
    async saveFile(file: UploadedFile, name?: string) {
        logger.info('save file')
        if (name === 'noimage.jpg') {
            name = null;
        }

        if (name) {
            name = name.replace('%0:', '');
        }

        let extension = file.name.split('.').pop();

        if (!ImagesManager.allowedExtensions.includes(extension)) {
            throw ApiError.validationError(`File extension is not valid "${extension}"`);
        }
        if (file.size > ImagesManager.maxFileSize) {
            throw ApiError.validationError('File is too big');
        }
        if (!name) {
            name = uuid.v4();
        }
        else {
            name = name.split('.')[0];
        }

        name = name + '.' + extension;

        const fullfilePath = path.join(process.env.static, this.filePath, name);
        this.result = '%0:' + name;

        console.log(fullfilePath);
        await file.mv(fullfilePath);
        return this.result;
    }

    async revert() {
        //files looks like: '%0:/uniqueimagename.jpg;%0:/anotherimage.jpg;%0:/oneanother.jpg;'
        //following code at first remove %0:, then split string by ;, then iterate over filenames and remove all
        if (this.result) {
            this.result.replace(new RegExp('%0:', 'g'), '').split(';').forEach(fileName => {
                fs.unlink(path.join(process.env.static, this.filePath, fileName), (err: Error) => {
                    if (err) {
                        logger.error('revert error', [err]);
                    }
                });
            });
        }
    }
};

export default ImagesManager;