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
    announceCode: DataTypes.STRING,
    announceVessel: DataTypes.STRING,
    terminalId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'announceVessel',
  });
  return announceVessel;
};