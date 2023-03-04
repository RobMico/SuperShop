import ApiError from "../error/ApiError";
import Validator from "../utils/Validator";

export default class EditBrandDto {
    name:string;
    description:string;
    brandId:number;
    img?:string;

    constructor(body: any) {
        this.description = Validator.ValidateDescription(body.description);
        this.name = Validator.ValidateBrandTypeName(body.name);
        this.brandId = Validator.ValidatePositiveNumber(body.brandId);
    }
}