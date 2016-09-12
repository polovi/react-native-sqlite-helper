# react-native-sqlite-helper

Open database helper for [andpor/react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage) based on android SQLiteOpenHelper


MyDBHelper.js
```javascript
import SQLiteOpenHelper from 'react-native-sqlite-helper'

class MyDbHelper extends SQLiteOpenHelper {
  constructor() {
    super('db_name', 201);
  }

  onCreate(db) {
    console.log("create");
  }

  onUpgrade(db, oldVersion, newVersion) {
    console.log("upgrade");
  }

  onDowngrade(db, oldVersion, newVersion) {
    console.log("upgrade");
  }
}

export default MyDbHelper
```

```javascript
import MyDBHelper from './MyDBHelper'

let dbHelper = new MyDBHelper();
let db = await this.dbHelper.getDatabase();
db.executeSql('SELECT * FROM some_table;').then((results) => {
  this.list = results.rows.raw();
});

```
