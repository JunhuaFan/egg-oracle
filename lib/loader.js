'use strict';

const assert = require('assert');
const OracleDB = require('./oracle');

let count = 0;

module.exports = app => {
  app.addSingleton('oracle', createOneClient);
};

function createOneClient(config, app) {
  assert(config.user && config.password && config.connectString,
    `[egg-oracle] '${config.connectString}', 'user: ${config.user}' are required on config`);
  app.coreLogger.info('[egg-oracle] connecting %s', config.connectString);
  let client = new OracleDB(config, app.coreLogger);
  app.beforeStart(async () => {
    const { rows } = await client.execute("select to_char(sysdate,'yyyy-MM-dd HH24:mi:ss') from dual", []);
    const index = count++;
    app.coreLogger.info(`[egg-oracle] instance[${index}] status OK, currentTime: ${rows[0][0]}`);
  });
  app.beforeClose(async () => {
    await client.destroy();
    client = null;
  });
  return client;
}
