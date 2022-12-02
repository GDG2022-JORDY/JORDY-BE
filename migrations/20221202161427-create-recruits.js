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
        type: Sequelize.STRING(255),
        allowNull: false
      },
      content: {
        type: Sequelize.STRING(6000)
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      event: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      eventDate: {
        type: Sequelize.STRING(100),
        allowNull: false
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