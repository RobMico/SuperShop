import { UploadedFile } from "express-fileupload";
import Validator from "../../utils/Validator";

export default class EditDeviceImagesDto {
    deviceId: number;
    removeImgs: string;
    addExternal: string;
    addLocal:UploadedFile[];
    constructor(body: any, addLocal?:UploadedFile|UploadedFile[]) {
        this.deviceId = Validator.ValidatePositiveNumber(body.deviceId, 'deviceId');
        this.removeImgs = Validator.ValidateString(body.removeImgs);
        this.addExternal = Validator.ValidateString(body.addExternal);
        if (addLocal && Array.isArray(addLocal)) {
            this.addLocal = addLocal;
        }
    }
}