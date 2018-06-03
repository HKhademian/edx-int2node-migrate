const mongodb = require('mongodb')

const database = {
  url: 'mongodb://localhost:27017/',
  name: 'edx-int2node-migrate'
}

async function main() {
  const connection = await mongodb.MongoClient.connect(database.url)
  const db = await connection.db(database.name)

  await migrate(db)

  console.log('migrate complete d:')
  process.exit(0)
}

async function migrate(db) {
  const migrate_data = require('./m3-customer-address-data.json')
  const tasks = migrate_data.map((data, index) =>
    db.collection('accounts').update({ _id: String(index + 1) }, { $set: data }))
	return await Promise.all(tasks)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})