class SQLiteTransaction {
  transaction = null

  constructor(transaction) {
    this.transaction = transaction;
  }

  getVersion() {
    return this.executeSql('PRAGMA user_version').then(results => parseInt(results.rows.item(0).user_version));
  }

  setVersion(version) {
    return this.executeSql(`PRAGMA user_version=${version}`);
  }

  executeSql(sql, bindArgs = []) {
    return new Promise((resolve, reject) => {
      this.transaction.executeSql(sql, bindArgs, (tx, results) => resolve(results), reject);
    });
  }
}

export default SQLiteTransaction
