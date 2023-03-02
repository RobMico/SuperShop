import { Column, HasMany, Table, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import DeviceModel from "./DeviceModel";
import CommonTypeInfoModel from "./CommonTypeInfoModel";

interface TypesCreationAttributes {
    name: string;
    img: string;
    description: string;
}


@Table({ tableName: 'type' })
export default class TypesModel extends Model<TypesModel, TypesCreationAttributes> {
    @Column({
        type: DataTypes.STRING, unique: true, allowNull: false, validate: {
            len: {
                args: [2, 50],
                msg: 'Name must contain between 2 and 50 characters.'
            },
            // not: {
            //     args: /[`<>{}\[\]\/]/,
            //     msg: 'Must be only letters',
            // }    
        }
    })
    name: string;
    @Column({ type: DataTypes.STRING, defaultValue: 'noimage.jpg' })
    img: string;
    @Column({ type: DataTypes.TEXT, defaultValue: '' })
    description: string;


    @HasMany(()=>DeviceModel)
    devices:DeviceModel[];

    @HasMany(()=>CommonTypeInfoModel)
    commonInfo:CommonTypeInfoModel[];
}