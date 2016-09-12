import SQLite from 'react-native-sqlite-storage'
import SQLiteTransaction from './SQLiteTransaction'

class SQLiteDatabase {
  path = null
  errorHandler = null
  connection = null

  constructor(path) {
    this.path = path;
  }

  open() {
    this.connection = SQLite.openDatabase(this.path, null, this.errorHandler);
  }

  close() {
    this.connection.close();
  }

  getVersion() {
    return this.executeSql('PRAGMA user_version').then(results => parseInt(results.rows.item(0).user_version));
  }

  setVersion(version) {
    return this.executeSql(`PRAGMA user_version=${version}`);
  }

  isOpen() {
    return this.connection.openDBs[this.connection.dbname];
  }

  createTransaction() {
    return new Promise((resolve, reject) => {
      this.connection.transaction((tx) => resolve(new SQLiteTransaction(tx)), reject);
    });
  }

  executeSql(sql, bindArgs = []) {
    return new Promise((resolve, reject) => {
      this.connection.executeSql(sql, bindArgs, resolve, reject);
    });
  }

  static create(path) {
    let db = new SQLiteDatabase(path);
    db.open();
    return db;
  }
}

export default SQLiteDatabase
