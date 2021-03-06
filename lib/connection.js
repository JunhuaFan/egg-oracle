'use strict';

class Connection {
  constructor(connection, log) {
    this._connection = connection;
    this.log = log;
  }
  async execute(sql, bindParams = {}, options = { outFormat: 4002 }) {
    if (typeof sql === 'string' && bindParams instanceof Object) {
      try {
        const result = await this._connection.execute(sql, bindParams, options);
        return result;
      } catch (err) {
        this.log.error(err.message);
        try {
          await this.close();
        } catch (closeError) {
          this.log.error(closeError.message);
          throw closeError;
        }
        throw err;
      }
    }
  }

  rollback() {
    return this._connection.rollback();
  }
  commit() {
    return this._connection.commit();
  }
  close() {
    return this._connection.close();
  }
}
module.exports = Connection;
