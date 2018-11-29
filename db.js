const Sequelize = require('sequelize');
const config=require('./config');
let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})
let defineModel = (name, attributes) => {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.id = {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    };
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if(obj.isNewRecord){
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                }
            },
            beforeUpdate:(obj)=>{
                //更新操作 将版本++和更新时间
                if (!obj.isNewRecord) {
                    obj.updatedAt = Date.now();
                    obj.version++;
                }
            }
           
        }
    });
}
const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN', 'ENUM'];
var exp = {
    defineModel: defineModel

};
for (let type of TYPES) {
    exp[type] = Sequelize[type];
}


module.exports = exp;