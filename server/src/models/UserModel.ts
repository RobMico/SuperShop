import { DataTypes, Op } from 'sequelize';
import { Column, HasMany, Table, Model } from 'sequelize-typescript';
import BasketRepository from './BasketModel';
import CommentsRepository from './CommentsModel';
import RatingRepository from './RatingModel';


interface UserCreationAttributes {
    email: string;
    password: string;
    role: string;
    name: string;
}

@Table({ tableName: 'users' })
class UserRepository extends Model<UserRepository, UserCreationAttributes> {
    @Column({
        type: DataTypes.STRING, unique: true,
        validate: {
            isEmail: {
                msg: 'Invalid email address'
            }
        }
    })
    email: string;

    @Column({ type: DataTypes.STRING })
    password: string;

    @Column({
        type: DataTypes.STRING, defaultValue: 'USER', validate: {
            len: {
                args: [3, 10],
                msg: 'Role must contain between 3 and 10 characters.'
            },
            isUppercase: {
                msg: 'Role must be UPPERCASE'
            },
        }
    })
    role: string;

    @Column({
        type: DataTypes.STRING, validate: {
            len: { args: [3, 30], msg: 'Role must contain between 3 and 30 characters.' }, is: {
                args: /^([A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
                msg: 'Must be only letters',
            }
        }
    })
    name: string;

    @HasMany(()=>CommentsRepository)
    comments:CommentsRepository[];

    @HasMany(()=>BasketRepository)
    basket:BasketRepository[];
    
    @HasMany(()=>RatingRepository)
    rates:RatingRepository[];
};

export default UserRepository;