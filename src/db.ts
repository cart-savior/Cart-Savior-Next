import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';


export const openDB = async() => {
    return open({
      filename: path.resolve(process.cwd(), 'src/cart_savior.db'),
      driver: sqlite3.Database
    });
  }