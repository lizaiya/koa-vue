const db = require('../db');

module.exports = db.defineModel('users', {
    email: {
        type: db.STRING(100),
        allowNull: true
    },
    token:{
        type: db.STRING(100),
        allowNull: true
    },
    birth:{
        type: db.STRING(100),
        allowNull: true
    },
    pwd:{
        type: db.STRING(100),
        allowNull: false
    },
    name: {
        type:db.STRING(100),
        allowNull :false,
        
        
    },
    gender: {
        type: db.ENUM('0', '1', '2'),
        allowNull: true
    }, 
});