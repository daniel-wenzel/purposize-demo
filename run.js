const prompt = require('prompt');
const Sequelize = require('sequelize');
const purposize = require('purposize')
const rawSQL = require('./demoSQL')
const highlight = require('cli-highlight').highlight


let jumps = 0

const sequelize = new Sequelize('testdb', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Prevent sequelize from logging all SQL queries
});
prompt.start();

run()
async function run() {
  await rawSQL("DROP DATABASE testdb; CREATE DATABASE testdb;")
  await showAndWait(`let Customer = sequelize.define('customers', {
  eMail: {
    type: Sequelize.STRING
  },
  postalAddress: {
    type: Sequelize.STRING
  },
  unfulfilledOrders: {
    type: Sequelize.INTEGER
  }
});
await sequelize.sync()
    `)
  let Customer = sequelize.define('customers', {
    eMail: {
      type: Sequelize.STRING,
    },
    postalAddress: {
      type: Sequelize.STRING,
    },
    unfulfilledOrders: {
      type: Sequelize.INTEGER
    }
  });

  await sequelize.sync({
    force: true
  })

  await showSQL("SHOW TABLES;")
  await showAndWait(`const purposize = require('purposize')
  purposize.init(sequelize, {
    logging: false
  })`)
  purposize.init(sequelize, {
    logging: false
  })
  await showAndWait(`let Customer = sequelize.define('customers', {
  eMail: {
    type: Sequelize.STRING,
    isPersonalData: true
  },
  postalAddress: {
    type: Sequelize.STRING,
    isPersonalData: true
  },
  unfulfilledOrders: {
    type: Sequelize.INTEGER
  }
  });
  await sequelize.sync({
    force: true
  })`)
  Customer = sequelize.define('customers', {
    eMail: {
      type: Sequelize.STRING,
      isPersonalData: true
    },
    postalAddress: {
      type: Sequelize.STRING,
      isPersonalData: true
    },
    unfulfilledOrders: {
      type: Sequelize.INTEGER
    }
  });

  await sequelize.sync({
    force: true
  })
  await showSQL("SHOW TABLES;")
  await showAndWait(`echo "
purposes:
- name: NEWSLETTER
  relevantFields:
    customers:
      - eMail
- name: ORDER
  relevantFields:
    customers:
      - eMail
      - postalAddress
- name: FULFILLMENT
  relevantFields:
    customers:
      - postalAddress
  compatibleWith:
    - ORDER
  " >> purposes.yml
`, 'bash')
  await showAndWait(`await purposize.loadPurposes('purposes.yml')`)
  await purposize.loadPurposes('purposes.yml')
  await showSQL("SELECT * FROM purposize_purposes")
  await showAndWait(`const alice = await Customer.create({
  eMail: 'alice@email.com',
  postalAddress: '1234 Shippington',
  unfulfilledOrders: 2
}, {
  purpose: 'ORDER'
})`)
  const alice = await Customer.create({
    eMail: 'alice@email.com',
    postalAddress: '1234 Shippington',
    unfulfilledOrders: 2
  }, {
    purpose: 'ORDER'
  })

  await showAndWait(`const bob = await Customer.create({
  eMail: 'bob@email.com',
  unfulfilledOrders: 0
}, {
  purpose: 'NEWSLETTER'
})`)
  const bob = await Customer.create({
    eMail: 'bob@email.com',
    unfulfilledOrders: 0
  }, {
    purpose: 'NEWSLETTER'
  })

  await showSQL("SELECT * FROM customers")
  await showSQL("SHOW TABLES")
  await showSQL("SELECT * FROM purposize_customersPurposes")
  await showAndWait(`await bob.update({
      postalAddress: '112 Shippington'
    })`)
  try {
    await bob.update({
      postalAddress: '112 Shippington'
    })
  }
  catch (e) {
    console.log(e)
  }
  await waitForPresentation()
  await showAndWait(`await Customer.findAll({})`)
  console.log((await Customer.findAll({})).map(c => c.dataValues))
  await waitForPresentation()

  await showAndWait(`await Customer.findAll({
    purpose: 'NEWSLETTER'
  })`)
  console.log((await Customer.findAll({
    purpose: 'NEWSLETTER'
  })).map(c => c.dataValues))
  await waitForPresentation()

  await showAndWait(`await Customer.findAll({
    purpose: 'FULFILLMENT'
  })`)
  console.log((await Customer.findAll({
    purpose: 'FULFILLMENT'
  })).map(c => c.dataValues))
  await waitForPresentation()

  await showAndWait(`await Customer.find({
    where: {
      postalAddress: '123 Shippington'
    },
    purpose: 'NEWSLETTER'
  })`)
  try {
    await Customer.find({
      where: {
        postalAddress: '123 Shippington'
      },
      purpose: 'NEWSLETTER'
    })
  }
  catch(e) {
    console.log(e)
  }
  await waitForPresentation()
  await showAndWait(`await bob.removePurpose('NEWSLETTER')`)
  await bob.removePurpose('NEWSLETTER')
  await showSQL('SELECT * FROM customers')
  process.exit(0)
}
async function waitForPresentation() {
  jumps--
  if (jumps > 0) return
  return new Promise((res, rej) => {
    prompt.get('< press ENTER to continue >', function(err, result) {
      res()
    });
  })
}

async function showAndWait(codeAsString, language) {
  //await waitForPresentation()
  console.log('> ' + highlight(codeAsString, {language: language || 'javascript', ignoreIllegals: true}))
  await waitForPresentation()
}

async function showSQL(SQL) {
  await showAndWait(SQL, 'sql')
  await rawSQL(SQL)
  await waitForPresentation()
}
