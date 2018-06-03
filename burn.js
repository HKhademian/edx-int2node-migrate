const mongodb = require('mongodb')

const database = {
  url: 'mongodb://localhost:27017/',
  name: 'edx-int2node-migrate'
}

async function main() {
  const connection = await mongodb.MongoClient.connect(database.url)
  const db = await connection.db(database.name)

  await burn(db)

  console.log('burn complete :)')
  process.exit(0)
}

async function burn(db) {
  const burn_data = require('./m3-customer-data.json')

  const tasks = burn_data.map(data => {
    data._id = data.id
    delete data.id
    return db.collection('accounts').insert(data)
  })
	return await Promise.all(tasks)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})