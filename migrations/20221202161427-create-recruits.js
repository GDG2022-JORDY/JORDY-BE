'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recruits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255)
      },
      content: {
        type: Sequelize.STRING(16000)
      },
      name: {
        type: Sequelize.STRING(30)
      },
      event: {
        type: Sequelize.STRING(30)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recruits');
  }
};