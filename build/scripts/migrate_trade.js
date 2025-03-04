// // First install required packages:
// // npm install mysql2
// // npm install @types/mysql2
// 'use strict'
// import mysql, { Connection, RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';
// import { randomBytes } from 'crypto';
// import argon2 from 'argon2';
// // db.ts
// import mongoose, { Schema } from 'mongoose';
// import mongooseLoader from '../loaders/mongoose';
// import User from "../models/user"
// import Trade from '../models/trade';
// import Transaction from "../models/transaction"
// // MongoDB connection configuration
// const MONGODB_CONFIG = {
//   username: 'doadmin',
//   password: 'sZxw6m270qv14y39',
//   cluster: 'swift-db-mongodb-fra1-56586-aae9133a.mongo.ondigitalocean.com',
//   database: 'admin', // Add your database name here
//   options: {
//       retryWrites: true,
//       w: 'majority'
//   }
// };
// // Construct MongoDB connection URL with proper authentication
// const MONGODB_URI = `mongodb+srv://${MONGODB_CONFIG.username}:${MONGODB_CONFIG.password}@${MONGODB_CONFIG.cluster}/${MONGODB_CONFIG.database}?retryWrites=true&w=majority`;
// // MongoDB connection URL (preferably from environment variables)
// // const MONGODB_URI = "mongodb+srv://swift-db-mongodb-fra1-56586-aae9133a.mongo.ondigitalocean.com/?retryWrites=true&w=majority";
// // Connect to MongoDB
// export async function connectToMongoDatabase() {
//     try {
//       // Suppress strictQuery warning
//       mongoose.set('strictQuery', false);  // or true, depending on your preference
//       await mongoose.connect(MONGODB_URI, {
//         // Add any additional connection options here
//         serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//         maxPoolSize: 10
//     });
//       console.log('Successfully connected to MongoDB.');
//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//       process.exit(1);
//     }
// }
// // Bulk create trades function
// export async function bulkCreateTrades(trades: any): Promise<any> {
//     try {
//       // Create trades in bulk
//       const result = await Trade.insertMany(trades, {
//         ordered: false, // Continues inserting even if there are errors
//         rawResult: true // Returns detailed information about the operation
//       });
//       console.log(`Successfully inserted ${result.insertedCount} trades`);
//       return result.mongoose.results;
//     } catch (error) {
//     //   if (error instanceof mongoose.Error) {
//     //     console.log(`Partially inserted ${error.insertedDocs.length} trades`);
//     //     console.error('Bulk write error:', error.writeErrors);
//     //   } else {
//     //     console.error('Error creating trades:', error);
//     //   }
//         console.error('Error creating trades:', error);
//       throw error;
//     }
// }
// // Bulk create transactions function
// export async function bulkCreateTransactions(tnxs: any): Promise<any> {
//     try {
//       // Create Transactions in bulk
//       const result = await Transaction.insertMany(tnxs, {
//         ordered: false, // Continues inserting even if there are errors
//         rawResult: true // Returns detailed information about the operation
//       });
//       console.log(`Successfully inserted ${result.insertedCount} transactions`);
//       return result.mongoose.results;
//     } catch (error) {
//     //   if (error instanceof mongoose.Error) {
//     //     console.log(`Partially inserted ${error.insertedDocs.length} transactions`);
//     //     console.error('Bulk write error:', error.writeErrors);
//     //   } else {
//     //     console.error('Error creating transactions:', error);
//     //   }
//         console.error('Error creating transactions:', error);
//       throw error;
//     }
// }
// // Define interface for database configuration
// interface DBConfig {
//   host: string;
//   user: string;
//   password: string;
//   database: string;
// }
// // Define interface for a sample database record
// interface DatabaseRecord extends RowDataPacket {
//   id: number;
//   name: string;
//   // Add other fields as needed
// }
// // Database configuration
// const dbConfig: DBConfig = {
//   host: 'swiftlynxtechnologies.com',
//   user: 'swiftlyn_swiftlyn_1',
//   password: 'swiftlyn_swiftlyn_',
//   database: 'swiftlyn_swiftlyn_',
// };
// // MySQL connection string format:
// // mysql://username:password@host:port/database
// const connectionString = `mysql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:3306/${dbConfig.database}`;
// async function connectToDatabase() {
//   try {
//     // Create connection
//     const connection: Connection = await mysql.createConnection(connectionString);
//     console.log('Successfully connected to database');
//     return connection;
//   } catch (err) {
//     console.error('Error connecting to the database:', err);
//     throw err;
//   }
// }
// /**
//  * Calculates start and end dates based on a given number of months from now
//  * @param numberOfMonths Number of months to calculate the date range
//  * @returns An object with startDate and endDate
//  */
// export function getDateRange(numberOfMonths: number, date?: any): { startDate: Date; endDate: Date } {
//     // Get the current date
//     const now = new Date(date);
//     // Create a copy of the current date to manipulate
//     const startDate = new Date(now);
//     // Set the start date to the first day of the current month
//     // startDate.setDate(1);
//     // Create an end date by adding the specified number of months
//     const endDate = new Date(now);
//     endDate.setMonth(now.getMonth() + numberOfMonths);
//     // Set the end date to the last day of the final month
//     // endDate.setDate(0); // This sets the date to the last day of the previous month
//     console.log("startDate", startDate)
//     console.log("endDate", endDate)
//     return {
//       startDate,
//       endDate 
//     };
//   }
//   function standardizeDate(date: string): string {
//     const [day, month, year] = date.split('-');
//     const paddedMonth = month.padStart(2, '0');
//     const paddedDay = day.padStart(2, '0');
//     return `${year}-${paddedMonth}-${paddedDay}`;
// }
// // Example usage:
// // console.log(standardizeDate("21-8-2024")); // Output: "2024-08-21"
// // get all users
// async function getAllTrades() {
//     let connection: Connection | undefined;
//     try {
//       connection = await connectToDatabase();
//       // Example query with type safety
//       const [rows] = await connection.execute<DatabaseRecord[]>(
//         'SELECT * FROM investments'
//       );
//       console.log('Query results:', rows.length);
//       return rows;
//     } catch (err) {
//       console.error('Error executing query:', err);
//       throw err;
//     } finally {
//       if (connection) {
//         try {
//           await connection.end();
//           console.log('Connection closed successfully');
//         } catch (err) {
//           console.error('Error closing connection:', err);
//         }
//       }
//     }
//   }
// // Example usage with async/await
// async function main() {
//   try {
//     await connectToMongoDatabase()
//     // Find all users
//     // get allusers
//     const old_trades = await getAllTrades();
//     const new_trades = []
//     for(let i = 0; i < old_trades.length; i++){
//         let o_trade = old_trades[i];
//         console.log('starting trade');
//         let trade_stat = 'PENDING';
//         // 'ACTIVE', 'DECLINED', 'COMPLETED', 
//         if (o_trade.stat === "completed") {
//             trade_stat = "COMPLETED"
//         } else if(o_trade.stat === "inactive"){
//             trade_stat = "PENDING"
//         } else if (o_trade.stat === "active"){
//             trade_stat = "COMPLETED"
//         }
//         const dateRange = getDateRange(parseInt(o_trade.counter), standardizeDate(o_trade.activeDate))
//         const user = await User.findOne({ 'metadata.users_id': o_trade.user})
//         new_trades.push({
//             userId: user._id,
//             projectId: user._id,
//             contractId: user._id,
//             type: 'SWIFT_TRADE',
//             status: trade_stat,
//             amount: o_trade.amount,
//             interest: o_trade.interest,
//             startDate: dateRange.startDate,
//             endDate: dateRange.endDate,
//             duration: o_trade.counter,
//             metadata: o_trade
//         })
//     }
//     // bulk create trades
//     const n_trades = await bulkCreateTrades(new_trades)
//     // create transactions
//     const transactions = n_trades.map((trade) => ({
//         user: trade.userId,
//         subject: trade?._id || trade?.id,
//         subjectRef: 'Trade',
//         type: 'credit',
//         txid: Math.floor(100000 + Math.random() * 900000),
//         reason: "Supply Liquidity",
//         status: 'pending',
//         from: null,
//         confirmations: true,
//         fee: 0,
//         metadata: {
//           entity: "trade",
//           entityId: trade?.id || trade?._id,
//         },
//         to:
//           {
//             amount: trade.amount,
//             recipient: "swiftlynx"
//           },
//     }));
//     const n_transactions = await bulkCreateTransactions(transactions)
//     console.log("created transactions", n_transactions)
//     console.log('Trade Migration completed successfully');
//   } catch (err) {
//     console.error('Error in main:', err);
//   }
// }
// console.log("running main function")
// // Run the main function
// main();
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const trade_1 = __importDefault(require("../models/trade"));
const transaction_1 = __importDefault(require("../models/transaction"));
// MongoDB connection configuration
const MONGODB_CONFIG = {
    username: 'doadmin',
    password: 'sZxw6m270qv14y39',
    cluster: 'swift-db-mongodb-fra1-56586-aae9133a.mongo.ondigitalocean.com',
    database: 'admin',
    options: {
        retryWrites: true,
        w: 'majority'
    }
};
// MySQL configuration
const MYSQL_CONFIG = {
    host: 'swiftlynxtechnologies.com',
    user: 'swiftlyn_swiftlyn_1',
    password: 'swiftlyn_swiftlyn_',
    database: 'swiftlyn_swiftlyn_',
};
// MongoDB Models (assuming these are your model structures)
const UserSchema = new mongoose_1.Schema({
    metadata: {
        users_id: String
    },
    // other user fields...
});
const TradeSchema = new mongoose_1.Schema({
    userId: mongoose_1.Schema.Types.ObjectId,
    projectId: mongoose_1.Schema.Types.ObjectId,
    contractId: mongoose_1.Schema.Types.ObjectId,
    type: String,
    status: String,
    amount: Number,
    interest: Number,
    startDate: Date,
    endDate: Date,
    duration: String,
    metadata: mongoose_1.Schema.Types.Mixed
});
const TransactionSchema = new mongoose_1.Schema({
    user: mongoose_1.Schema.Types.ObjectId,
    subject: mongoose_1.Schema.Types.ObjectId,
    subjectRef: String,
    type: String,
    txid: Number,
    reason: String,
    status: String,
    from: mongoose_1.Schema.Types.Mixed,
    confirmations: Boolean,
    fee: Number,
    metadata: {
        entity: String,
        entityId: mongoose_1.Schema.Types.ObjectId
    },
    to: {
        amount: Number,
        recipient: String
    }
});
// const User = mongoose.model('User', UserSchema);
// const Trade = mongoose.model('Trade', TradeSchema);
// const Transaction = mongoose.model('Transaction', TransactionSchema);
// Database connection functions
async function connectToMongoDatabase() {
    const MONGODB_URI = `mongodb+srv://${MONGODB_CONFIG.username}:${MONGODB_CONFIG.password}@${MONGODB_CONFIG.cluster}/${MONGODB_CONFIG.database}?retryWrites=true&w=majority`;
    try {
        mongoose_1.default.set('strictQuery', false);
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });
        console.log('Successfully connected to MongoDB.');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
async function connectToMySQLDatabase() {
    const connectionString = `mysql://${MYSQL_CONFIG.user}:${MYSQL_CONFIG.password}@${MYSQL_CONFIG.host}:3306/${MYSQL_CONFIG.database}`;
    try {
        const connection = await promise_1.default.createConnection(connectionString);
        console.log('Successfully connected to MySQL database');
        return connection;
    }
    catch (err) {
        console.error('Error connecting to MySQL database:', err);
        throw err;
    }
}
// Utility functions
function getDateRange(numberOfMonths, date) {
    const now = new Date(date || Date.now());
    const endDate = new Date(now);
    endDate.setMonth(now.getMonth() + numberOfMonths);
    return { startDate: now, endDate };
}
function standardizeDate(date) {
    const [day, month, year] = date.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
function mapTradeStatus(oldStatus) {
    const statusMap = {
        'completed': 'COMPLETED',
        'inactive': 'PENDING',
        'active': 'COMPLETED'
    };
    return statusMap[oldStatus] || 'PENDING';
}
// Data operations
async function getAllTrades() {
    let connection;
    try {
        connection = await connectToMySQLDatabase();
        const [rows] = await connection.execute('SELECT * FROM investments');
        return rows;
    }
    finally {
        if (connection)
            await connection.end();
    }
}
async function bulkCreateTrades(trades) {
    try {
        const result = await trade_1.default.insertMany(trades, {
            ordered: false,
            rawResult: true
        });
        console.log(`Successfully inserted ${result.insertedCount} trades`);
        return result.mongoose.results;
    }
    catch (error) {
        console.error('Error creating trades:', error);
        throw error;
    }
}
async function bulkCreateTransactions(transactions) {
    try {
        const result = await transaction_1.default.insertMany(transactions, {
            ordered: false,
            rawResult: true
        });
        console.log(`Successfully inserted ${result.insertedCount} transactions`);
        return result.mongoose.results;
    }
    catch (error) {
        console.error('Error creating transactions:', error);
        throw error;
    }
}
// Main migration function
async function main() {
    try {
        // 1. Connect to MongoDB
        await connectToMongoDatabase();
        // 2. Get all trades from MySQL
        console.log('Fetching trades from MySQL...');
        const oldTrades = await getAllTrades();
        console.log(`Found ${oldTrades.length} trades to migrate`);
        // 3. Extract unique user IDs and fetch users
        const uniqueUserIds = [...new Set(oldTrades.map(trade => parseInt(trade.user)))];
        console.log(`Found ${uniqueUserIds.length} unique users`);
        const validUserIds = uniqueUserIds.filter(id => !isNaN(id));
        console.log('Sample user IDs:', validUserIds.slice(0, 5));
        const users = await user_1.default.find({ "metadata.users_id": { $in: validUserIds } }).exec();
        console.log(`Fetched ${users.length} users from MongoDB`);
        // 4. Create user lookup map
        const userMap = new Map(users.map(user => { var _a; return [`${(_a = user === null || user === void 0 ? void 0 : user.metadata) === null || _a === void 0 ? void 0 : _a.users_id}`, user]; }));
        console.log("userMap", userMap);
        // 5. Prepare trades data
        console.log('Preparing trade data...');
        const newTrades = oldTrades.map(o_trade => {
            const user = userMap.get(o_trade.user);
            if (!user) {
                console.warn(`User not found for trade ${o_trade.id}`);
                return null;
            }
            const dateRange = getDateRange(parseInt(o_trade.counter), standardizeDate(o_trade.activeDate));
            return {
                userId: user._id,
                projectId: user._id,
                contractId: user._id,
                type: 'SWIFT_TRADE',
                status: mapTradeStatus(o_trade.stat),
                amount: o_trade.amount,
                interest: o_trade.interest,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                duration: o_trade.counter,
                metadata: o_trade
            };
        }).filter(Boolean);
        // 6. Bulk create trades
        console.log('Creating new trades...');
        const newTradesResult = await bulkCreateTrades(newTrades);
        // 7. Prepare and create transactions
        console.log('Preparing transactions...');
        const transactions = newTradesResult.map(trade => ({
            user: trade.userId,
            subject: trade._id || trade.id,
            subjectRef: 'Trade',
            type: 'credit',
            txid: Math.floor(100000 + Math.random() * 900000),
            reason: "Supply Liquidity",
            status: 'pending',
            from: null,
            confirmations: true,
            fee: 0,
            metadata: {
                entity: "trade",
                entityId: trade.id || trade._id,
            },
            to: {
                amount: trade.amount,
                recipient: "swiftlynx"
            },
        }));
        console.log('Creating transactions...');
        const newTransactions = await bulkCreateTransactions(transactions);
        console.log(`
Migration completed successfully:
- Processed ${oldTrades.length} trades
- Created ${newTradesResult.length} new trades
- Created ${newTransactions.length} transactions
        `);
    }
    catch (err) {
        console.error('Error in migration:', err);
        throw err;
    }
    finally {
        // Close MongoDB connection
        await mongoose_1.default.connection.close();
        console.log('Closed MongoDB connection');
    }
}
// Run the migration
console.log('Starting migration...');
main().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
//# sourceMappingURL=migrate_trade.js.map