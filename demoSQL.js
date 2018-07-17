
var exec = require('child-process-promise').exec;

module.exports = async (SQL) => {
  result = await exec("mysql --user='root' --password='123456' --database='testdb' -t --execute='"+SQL+"'")
  console.log(result.stdout)
}
