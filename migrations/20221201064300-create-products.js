'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      publicProductId: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
      },
      productId: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
      },
      productName: {
        type: Sequelize.STRING(50),
        unique : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};