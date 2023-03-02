import ApiError from "../error/ApiError";
import Validator from "../utils/Validator";

export default class AddDeviceBasket {
    deviceId: number;
    deviceCount: number;
    constructor(body: any) {
        this.deviceCount = Validator.ValidatePositiveNumber(body.deviceCount);
        this.deviceId = Validator.ValidatePositiveNumber(body.deviceId);
    }
}