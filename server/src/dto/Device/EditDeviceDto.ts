import Validator from "../../utils/Validator";
import DeviceInfoDto from "./DeviceInfoDto";

export default class EditDeviceDto{
    deviceId:number;
    name:string;
    price:number;
    brandId:number;
    typeId:number;
    info:DeviceInfoDto[];
    constructor(body:any)
    {
        this.deviceId = Validator.ValidatePositiveNumber(body.deviceId);
        this.name = Validator.ValidateDeviceName(body.name);
        this.price = Validator.ValidatePositiveNumber(body.price);
        this.brandId = Validator.ValidatePositiveNumber(body.brandId);
        this.typeId = Validator.ValidatePositiveNumber(body.typeId);
        this.info = Validator.ValidateDeviceInfo(body.info);
    }
}