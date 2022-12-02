'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Statistics', {
      optionId: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      sellDate: {
        type: Sequelize.DATEONLY
      },
      totalSell: {
        type: Sequelize.SMALLINT
      },
      stockAmount: {
        type: Sequelize.SMALLINT
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Statistics');
  }
};