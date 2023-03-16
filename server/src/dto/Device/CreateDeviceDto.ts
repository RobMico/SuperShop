import Validator from "../../utils/Validator";
import DeviceInfoDto from "./DeviceInfoDto";



class CreateDeviceDto {
    name: string;
    price: number;
    brandId: number;
    typeId: number;
    disabled: boolean = false;
    info: DeviceInfoDto[];
    img?: string;
    constructor(body: any) {
        this.name = Validator.ValidateBrandTypeName(body.name, 'name');
        this.price = Validator.ValidatePositiveNumber(body.price, 'price');
        this.brandId = Validator.ValidatePositiveNumber(body.brandId, 'brandId');
        this.typeId = Validator.ValidatePositiveNumber(body.typeId, 'typeId');
        if (this.disabled) {
            this.disabled = Validator.ValidateBoolean(body.disabled, 'disabled');
        }
        this.info = Validator.ValidateDeviceInfo(body.info);
    }
}




export default CreateDeviceDto;