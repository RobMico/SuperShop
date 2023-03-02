import sequelize from '../db';
import { DataTypes, Op } from 'sequelize';
//const sequelize = require('../db');
//const {DataTypes, Op} = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
        type: DataTypes.STRING, unique: true,
        validate: {
            isEmail: {
                msg: 'Invalid email address'
            }
        }
    },
    password: { type: DataTypes.STRING },
    role: {
        type: DataTypes.STRING, defaultValue: 'USER', validate: {
            len: {
                args: [3, 10],
                msg: 'Role must contain between 3 and 10 characters.'
            },
            isUppercase: {
                msg: 'Role must be UPPERCASE'
            },
        }
    },
    name: {
        type: DataTypes.STRING, validate: {
            len: { args: [3, 30], msg: 'Role must contain between 3 and 30 characters.' }, is: {
                args: /^([A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
                msg: 'Must be only letters',
            }
        }
    }
});

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    count: {
        type: DataTypes.INTEGER, validate: {
            myValid: (num) => {
                if (num <= 0) {
                    throw { message: 'Count must be above zero', path: 'price', type: 'Validation error' }
                }
            }
        }
    }
});

const Device = sequelize.define('device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        type: DataTypes.STRING, unique: true, allowNull: false, validate: {
            len: {
                args: [3, 150],
                msg: 'Name must contain between 5 and 50 characters.'
            },
            not: {
                args: /[`<>]/,
                msg: 'Must be only letters',
            }
        }
    },
    price: {
        type: DataTypes.DECIMAL, allowNull: false, validate: {
            custom: (el) => {
                if (el < 0) { throw { message: 'Price must be above zero', path: 'price', type: 'Validation error' } }
            }
        }
    },
    img: { type: DataTypes.STRING, allowNull: false },
    rate: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
    ratecount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    avaliable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
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
    },
    img: { type: DataTypes.STRING, defaultValue: 'noimage.jpg' },
    description: { type: DataTypes.TEXT, defaultValue: '' }
});

const Brand = sequelize.define('brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
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
    },
    img: { type: DataTypes.STRING, defaultValue: 'noimage.jpg' },
    description: { type: DataTypes.TEXT, defaultValue: '' }
});

const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: {
        type: DataTypes.DECIMAL, allowNull: false, validate: {
            min: 0,
            max: 5
        }
    },
    comment: {
        type: DataTypes.STRING, allowNull: true, validate: {
            len: {
                args: [0, 50000],
                msg: 'Comment can not be more than 50000 characters'
            },
            // not: {
            //     args: /[`<>{}\[\]\/]/,
            //     msg: 'Must be only letters',
            // }
        }
    },
    userName: {
        type: DataTypes.STRING, allowNull: false
    }
});

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comment: {
        type: DataTypes.STRING, allowNull: true, validate: {
            len: {
                args: [5, 50000],
                msg: 'Comment must contain between 5 and 50000 characters'
            }
        }
    },
    userName: {
        type: DataTypes.STRING, allowNull: false
    }
});


const DeviceInfo = sequelize.define('device_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
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
    },
    numPart: { type: DataTypes.DECIMAL, defaultValue: null },
    textPart: {
        type: DataTypes.STRING, validate: {
            len: {
                args: [0, 300],
                msg: 'Description can not be more then 300 characters.'
            }
        }
    }
});

const TypeBrand = sequelize.define('type_brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const CommonTypeInfo = sequelize.define('type_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    require: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    filter: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    searchByNum: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    searchProps: { type: DataTypes.STRING, defaultValue: '' }
});


User.hasMany(Comment, { as: 'comment' });
Comment.belongsTo(User);

Rating.hasMany(Comment, { as: 'comments' });
Comment.belongsTo(Rating);

User.hasMany(Basket);
Basket.belongsTo(User);

Device.hasMany(Basket);
Basket.belongsTo(Device, { as: 'device' });

User.hasMany(Rating, { as: 'rating' });
Rating.belongsTo(User);

Device.hasMany(DeviceInfo);
DeviceInfo.belongsTo(Device);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating, { as: 'rating' });
Rating.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

Type.hasMany(CommonTypeInfo, { as: 'properties' });
CommonTypeInfo.belongsTo(Type);

export {
    Comment,
    User,
    Basket,
    Device,
    Type,
    Brand,
    Rating,
    DeviceInfo,
    TypeBrand,
    CommonTypeInfo,
    sequelize,
    Op
}