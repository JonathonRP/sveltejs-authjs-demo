import SequelizeAdapter from '@auth/sequelize-adapter';
import { Sequelize } from 'sequelize';

export const db = new Sequelize('sqlite::memory:');
export const adapter = SequelizeAdapter(db);

// Calling sync() is not recommended in production
db.sync();
