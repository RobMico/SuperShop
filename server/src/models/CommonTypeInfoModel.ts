import { BelongsTo, Column, ForeignKey, Table, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import TypesModel from "./TypeModel";

interface CommonTypeInfoCreationAttributes {
    name: string;
    require: boolean;
    filter: boolean;
    searchByNum: boolean;
    searchProps: string;
    brandId:number;
}


@Table({ tableName: 'type_info' })
export default class CommonTypeInfoModel extends Model<CommonTypeInfoModel, CommonTypeInfoCreationAttributes> {
    @Column({ type: DataTypes.STRING, allowNull: false })
    name: string;
    @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
    require: boolean;
    @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true })
    filter: boolean;
    @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true })
    searchByNum: boolean;
    @Column({ type: DataTypes.STRING, defaultValue: '' })
    searchProps: string;


    @ForeignKey(()=>TypesModel)
    @Column({type: DataTypes.INTEGER})
    brandId:number;

    @BelongsTo(()=>TypesModel)
    brand:TypesModel;
}