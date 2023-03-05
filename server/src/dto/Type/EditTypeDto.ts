import ApiError from "../../error/ApiError";
import Validator from "../../utils/Validator";

export default class EditTypeDto {
    typeId:number;
    name:string;
    description:string;
    img?:string;
    constructor(body: any) {
        this.name = Validator.ValidateBrandTypeName(body.name);
        this.description = Validator.ValidateBrandTypeName(body.description);
        this.typeId = Validator.ValidatePositiveNumber(body.typeId);
    }
}