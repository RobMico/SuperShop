import ApiError from "../../error/ApiError";
import Validator from "../../utils/Validator";

export default class CreateTypePropDto {
    typeId: number;
    title: string;
    values: string[];
    constructor(body: any) {
        this.title = Validator.ValidateBrandTypeName(body.title);
        this.typeId = Validator.ValidatePositiveNumber(body.typeId);
        this.values = Validator.ValidatePropsValues(body.values);
    }
}