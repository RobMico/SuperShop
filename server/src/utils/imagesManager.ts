import ApiError from "../error/ApiError";
import * as fs from 'fs';
import path from 'path';
import uuid from 'uuid';

class ImagesManager {
    /*
        param filePath will be added to static dir
        allowedExtensions filter incoming files by file allowedExtensions
        maxFileSize filter incoming file by size
    */
    filePath: string = '';
    allowedExtensions: string[] = ['jpg'];
    maxFileSize: number = 5200000;
    result: string = '';
    constructor(filePath: string | null = null, allowedExtensions: string[] | null = null, maxFileSize: number | null = null) {
        filePath && (this.filePath = filePath);
        allowedExtensions && (this.allowedExtensions = allowedExtensions);
        maxFileSize && (this.maxFileSize = maxFileSize);
    }

    async saveFiles(files) {
        //needed to run promise all
        let writeAll = [];
        //If only one image is sent, here i get an object instead of an array(a single image is not good at all)
        if (!files.length) {
            throw ApiError.badRequest('Files not found');
        }

        //Files validation
        for (let i = 0; i < files.length; i++) {
            let extension = files[i].name.split('.').pop();

            if (this.allowedExtensions.includes(extension)) {
                throw ApiError.validationError('File extension is not valid');
            }
            if (files[i].size > this.maxFileSize)//5200000 5mb
            {
                throw ApiError.validationError('File is too big');
            }
            let newFileName = uuid.v4() + '.' + extension;
            this.result += '%0:' + newFileName + ';';

            //we get an array of files, if we start saving them now and some of the subsequent ones are invalid, 
            //then we will have to delete all those already saved, so we save all save functions in array, and if all files correct just call all
            writeAll.push(() => files[i].mv(path.resolve(process.env.static, this.filePath, newFileName)));
        }

        try {
            await Promise.all(writeAll.map(fn => fn()));
            return this.result;
        } catch (ex) {
            throw ApiError.internal('File saving failed');
        }
    }
    async saveFile(file, name?: string) {
        let extension = file.name.split('.').pop();

        if (!this.allowedExtensions.includes(extension)) {
            throw ApiError.validationError('File extension is not valid');
        }
        if (file.size > this.maxFileSize) {
            throw ApiError.validationError('File is too big');
        }
        if (!name) {
            name = uuid.v4();
        }
        else {
            name = name.split('.')[0];
        }
        name = name + '.' + extension;

        const fullfilePath = path.resolve(process.env.static, this.filePath, name);
        this.result = '%0:' + name;

        await file.mv(fullfilePath);
        return this.result;
    }

    async removeFiles() {
        //files looks like: '%0:/uniqueimagename.jpg;%0:/anotherimage.jpg;%0:/oneanother.jpg;'
        //following code at first remove %0:, then split string by ;, then iterate over filenames and remove all
        this.result.replace(new RegExp('%0:', 'g'), '').split(';').forEach(fileName => {
            fs.unlink(path.resolve(process.env.static, this.filePath, fileName), (err: Error) => {
                if (err) {
                    //TODO: logging
                }
            });
        });
    }
};

export default ImagesManager;