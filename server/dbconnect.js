const Sequelize  = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:27356@localhost:5432/identity_database',{
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});
// test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const db={}
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.user = require("./models/model")(sequelize,Sequelize) ;
  module.exports  = db ;