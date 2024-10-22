'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class terminal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  terminal.init({
    terminalId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    terminalCode: DataTypes.STRING,
    terminalName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'terminal',
  });
  return terminal;
};