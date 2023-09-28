import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('mysql', () => ({
  type: 'mysql', // 数据库类型
  host: process.env.MYSQL_HOST, // 数据库的连接地址host
  port: process.env.MYSQL_PORT, // 数据库的端口 3306
  username: process.env.MYSQL_USER, // 连接账号
  password: process.env.MYSQL_PASSWORD, // 连接密码
  database: process.env.MYSQL_DATABASE, // 连接的表名
  retryDelay: 500, // 重试连接数据库间隔
  retryAttempts: 10, // 充实次数
  synchronize: process.env.NODE_ENV === 'local', // 是否将实体同步到数据库
  autoLoadEntities: true, // 自动加载实体配置，forFeature()注册的每个实体都自己动加载
  namingStrategy: new SnakeNamingStrategy(),
}));
