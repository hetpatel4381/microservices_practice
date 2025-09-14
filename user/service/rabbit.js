const amqp = require("amqplib");
const rabbitMQUrl = process.env.RABBIT_MQ_URL;

let connection, channel;

async function connectRabbitMQ() {
  connection = await amqp.connect(rabbitMQUrl);
  channel = await connection.createChannel();
  console.log("Connected to RabbitMQ");
}

async function subscribeToQueue(queueName, callback) {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queueName);
  channel.consume(queueName, (message) => {
    callback(message.content.toString());
    channel.ack(message);
  });
}

async function publishToQueue(queueName, data) {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
  connectRabbitMQ,
  subscribeToQueue,
  publishToQueue,
};
