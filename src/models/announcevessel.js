'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class announceVessel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  announceVessel.init({
    announceId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    announceCode: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Username harus unik'
      }
    },
    announceVessel: DataTypes.STRING,
    voyage: DataTypes.STRING,
    terminalId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'announceVessel',
  });

  const Terminal = require('./terminal')(sequelize, DataTypes)
  announceVessel.belongsTo(Terminal, {
    foreignKey: 'terminalId',
  })

  return announceVessel;
};