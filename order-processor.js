const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const dynamo = new DynamoDBClient({ region: "us-east-1" });
const eventbridge = new EventBridgeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  for (const record of event.Records) {
    const order = JSON.parse(record.body);
    console.log("Processing order:", order.orderId);

    await dynamo.send(new PutItemCommand({
      TableName: "cloudcommerce-orders",
      Item: {
        orderId: { S: order.orderId },
        status: { S: "processing" },
        items: { S: JSON.stringify(order.items || []) },
        createdAt: { S: new Date().toISOString() }
      }
    }));

    await eventbridge.send(new PutEventsCommand({
      Entries: [{
        EventBusName: "cloudcommerce-events",
        Source: "cloudcommerce.orders",
        DetailType: "OrderPlaced",
        Detail: JSON.stringify(order)
      }]
    }));

    console.log("Order processed:", order.orderId);
  }
  return { statusCode: 200 };
};
