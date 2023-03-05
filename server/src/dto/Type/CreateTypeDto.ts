import ApiError from "../../error/ApiError";
import Validator from "../../utils/Validator";

export default class CreateTypeDto {
    name:string;
    description:string;
    img?:string;
    constructor(body: any) {
        this.name = Validator.ValidateBrandTypeName(body.name);
        this.description = Validator.ValidateDescription(body.description);
    }
}