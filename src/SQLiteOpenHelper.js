import SQLiteDatabase from './SQLiteDatabase'

class SQLiteOpenHelper {
  name = null
  version = null
  db = null

  constructor(name, version) {
    this.name = name;
    this.version = version;
  }

  getDatabaseName() {
    return this.name;
  }

  async getDatabase() {
    if (this.db && this.db.isOpen()) {
      return this.db;
    }

    let db = this.db;

    try {
      let path = this.getDatabasePath(this.name);
      db = SQLiteDatabase.create(path);

      let version = await db.getVersion();
      if (version !== this.version) {
        db.createTransaction().then(tx => {
          if (version == 0) {
            this.onCreate(tx);
          } else if (version > this.version) {
            this.onDowngrade(tx, version, this.version);
          } else {
            this.onUpgrade(tx, version, this.version);
          }
          tx.setVersion(this.version);
        });
      }

      this.onOpen(db);

      this.db = db;
      return db;
    } finally {
      if (db != null && db != this.db) {
        db.close();
      }
    }
  }

  getDatabasePath(name) {
    return {
      name: name,
      createFromLocation: 1
    }
  }

  close() {
    if (this.db && this.db.isOpen()) {
      this.db.close();
      this.db = null;
    }
  }

  /*
   * Called when the database is created for the first time.
   */
  onCreate(db) {}

  /*
   * Called when the database needs to be upgraded.
   */
  onUpgrade(db, oldVersion, newVersion) {}

  /*
   * Called when the database needs to be downgraded.
   */
  onDowngrade(db, oldVersion, newVersion) {
    throw new Error(`Can't downgrade database from version ${oldVersion} to ${newVersion}`);
  }

  /*
   * Called when the database has been opened.
   */
  onOpen(db) {}
}

export default SQLiteOpenHelper
