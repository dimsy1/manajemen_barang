import dotenv from "dotenv"
import mysql from "mysql2/promise"

dotenv.config();

interface IDatabase {
    getconnection(): any
}

class Database implements IDatabase {
    private static instance: mysql.Pool

    private constructor() {}

    public getconnection() {
        if (!Database.instance) {
            Database.instance = mysql.createPool({
                host: process.env.DB_HOST as string,
                user: process.env.DB_USER as string,
                password: process.env.DB_PASS as string,
                database: process.env.DB_NAME as string,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            })
            console.log("Koneksi database berhasil dinisialisasi")
        }
        return Database.instance
    }

    public static getInstance(): Database {
        return new Database
    }
}

export default Database