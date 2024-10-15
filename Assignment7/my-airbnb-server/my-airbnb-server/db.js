const mysql=require('mysql2')//taking database files of mysql
//json format
const pool =mysql.createPool({
    host:'localhost',//key :value pair
    user:'root',
    password:'manager',
    port:'3306',
    database:'airbnb_db',
    connectionLimit:10,
})
module.exports = {
    pool,
}