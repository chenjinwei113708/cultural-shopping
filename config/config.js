module.exports = {
  environment: 'dev',
  database: {
    dbName: 'cultural',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '111122'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60
  }
}
