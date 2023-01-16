const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: "http://localhost:9200",
});

client.ping().then(console.log).catch(console.error);

module.exports = client;
