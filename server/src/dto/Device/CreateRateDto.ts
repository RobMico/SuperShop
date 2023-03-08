import ApiError from "../../error/ApiError";
import Validator from "../../utils/Validator";

export default class CreateRateDto {
    comment: string;
    rate: number;
    deviceId: number;
    constructor(body: any) {
        this.comment = Validator.ValidateString(body.comment, false);
        this.deviceId = Validator.ValidatePositiveNumber(body.deviceId, 'deviceId');
        this.rate = Validator.ValidatePositiveNumber(body.rate, 'rate');
        if (this.rate > 5) {
            throw ApiError.validationError('Rate can not be more then 5');
        }
    }
}