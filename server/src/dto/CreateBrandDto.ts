import ApiError from "../error/ApiError";
import Validator from "../utils/Validator";

export default class CreateBrandDto {
    name:string;
    description:string;
    img?:string;
    constructor(body: any) {
        this.description = Validator.ValidateDescription(body.description);
        this.name = Validator.ValidateBrandTypeName(body.name);
    }
}