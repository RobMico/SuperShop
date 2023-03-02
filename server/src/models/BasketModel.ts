import { Column, ForeignKey, Table, BelongsTo, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import UserModel from "./UserModel";
import DeviceModel from "./DeviceModel";

interface BasketCreationAttributes {
    count: number;
}


@Table({ tableName: 'basket' })
export default class BasketModel extends Model<BasketModel, BasketCreationAttributes> {
    @Column({
        type: DataTypes.INTEGER, validate: {
            myValid: (num) => {
                if (num <= 0) {
                    throw { message: 'Count must be above zero', path: 'price', type: 'Validation error' }
                }
            }
        }
    })
    count: number;

    @ForeignKey(()=>UserModel)
    @Column({type: DataTypes.INTEGER})
    userId:number;

    @BelongsTo(()=>UserModel)
    user:UserModel;

    @ForeignKey(()=>DeviceModel)
    @Column({type: DataTypes.INTEGER})
    deviceId:number;

    @BelongsTo(()=>DeviceModel)
    device:UserModel;
}