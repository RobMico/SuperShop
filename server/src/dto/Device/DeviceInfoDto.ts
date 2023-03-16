import Validator from "../../utils/Validator";


//Universal dto
export default class DeviceInfoDto {
    textPart: string;
    numPart: number;
    title: string;
    deviceId: number;
    id: number;
    remove: boolean;
    edit?:string;
    constructor(obj: any) {
        this.title = Validator.ValidateBrandTypeName(obj.title);
        this.textPart = Validator.ValidateBrandTypeName(obj.textPart);
        this.numPart = Validator.isNumber(obj.numPart);
        if (obj.id) {
            this.id = Validator.ValidatePositiveNumber(obj.id, 'id');
        }
        if (obj.remove) {
            this.remove = Validator.ValidateBoolean(obj.remove, 'remove');
        }
    }
}