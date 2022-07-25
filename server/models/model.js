module.exports = (sequelize,Sequelize)=>{
    var user= sequelize.define('users',{
      id:{
          field : 'id',
          type:Sequelize.INTEGER ,
          primaryKey : true ,
          autoIncrement : true 
      },
      first_name:{
          field : 'first_name',
          type: Sequelize.STRING,
          allowNull: false,
      },
      last_name:{
          field : 'last_name',
          type: Sequelize.STRING,
          allowNull: false,
      },
      username:{
          field : 'username',
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      password:{
          field : 'password',
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
      },
      phone_number:{
          field : 'phone_number',
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      email:{
          field : 'email',
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      is_active:{
          field : 'is_active',
          type: Sequelize.BOOLEAN,
          allowNull: false,
          unique :false
      },
      is_admin:{
          field : 'is_admin',
          type: Sequelize.BOOLEAN,
          allowNull: false,
          unique: false,
      },
      updated_at:{
          field: 'updated_at' ,
          type: Sequelize.DATE,
          //defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),

      },
      updated_by:{
        field: 'updated_by' ,
        type: Sequelize.DATE,
       // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),

    },
    created_at:{
        field: 'created_at' ,
        type: Sequelize.DATE,
       // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),

    }
  }, {
    timestamps: false
  });
  return user ;

}
