import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';

export default async (): Promise<any> => {
  const { connection } = await mongoose.connect(config.databaseURL, 
  // {
  //   useCreateIndex: true,
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // }
  );
  return connection;

  // const connection = await mongoose.createConnection(config.databaseURL);

  // return connection;
};
