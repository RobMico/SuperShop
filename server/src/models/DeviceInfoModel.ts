import { BelongsTo, Column, ForeignKey, Table, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import DeviceModel from "./DeviceModel";

interface DeviceInfoCreationAttributes {
    title: string;
    numPart: number;
    textPart: string;
}


@Table({ tableName: 'device_info' })
export default class DeviceInfoModel extends Model<DeviceInfoModel, DeviceInfoCreationAttributes> {
    @Column({
        type: DataTypes.STRING, allowNull: false, validate: {
            len: {
                args: [3, 300],
                msg: 'Title must contain between 3 and 300 characters.'
            },
            // not: {
            //     args: /[`<>{}\[\]\/]/,
            //     msg: 'Must be only letters',
            // }    
        }
    })
    title: string;
    @Column({ type: DataTypes.DECIMAL, defaultValue: null })
    numPart: number;
    @Column({
        type: DataTypes.STRING, validate: {
            len: {
                args: [0, 300],
                msg: 'Description can not be more then 300 characters.'
            }
        }
    })
    textPart: string;

    @ForeignKey(()=>DeviceModel)
    @Column({type: DataTypes.INTEGER})
    deviceId:number;

    @BelongsTo(()=>DeviceModel)
    device:DeviceModel;
}