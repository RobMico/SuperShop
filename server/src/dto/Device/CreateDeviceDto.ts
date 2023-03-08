import Validator from "../../utils/Validator";
import DeviceInfoDto from "./DeviceInfoDto";



class CreateDeviceDto {
    name: string;
    price: number;
    brandId: number;
    typeId: number;
    disabled: boolean;
    info: DeviceInfoDto[];
    img?: string;
    constructor(body: any) {
        this.name = Validator.ValidateBrandTypeName(body.name);
        this.price = Validator.ValidatePositiveNumber(body.price);
        this.brandId = Validator.ValidatePositiveNumber(body.brandId);
        this.typeId = Validator.ValidatePositiveNumber(body.typeId);
        this.disabled = Validator.ValidateBoolean(body.disabled);
        this.info = Validator.ValidateDeviceInfo(body.info);
    }
}




export default CreateDeviceDto;