const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const {  DynamoDBClient, PutItemCommand , QueryCommand , BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb") ;

const{ SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const router = express.Router();
const client = new DynamoDBClient({
    region: "us-east-1"
});

const snsClient = new SNSClient({
  region: "us-east-1"
});


router.post("/", async (req,res) => {


  try {

    const userid = req. queryStringParameters.user_id;
    const orderid = crypto.randomUUID();
    const products = req.body.products;
    console.log(products);

    const orderplaceddate = req.body.dateplaced;
    const ordertotal = req.body.totalcost;
    const status = req.body.status || "Pending";

    const params = {

        TableName: "Ricemill_orders_cdk",

        Item: {

            user_id: {
                S: userid
            },

            order_id: {
                S: orderid
            },

            totalcost: {
                N: ordertotal.toString()
            },

            orderplaceddate: {
                S: orderplaceddate
            },

            status: {
                S: status
            },

            products: {
                L: products.map(product => ({
                    M: {
                        productid: {
                            S: product.product_id
                        },
                        quantity: {
                            N: product.quantity.toString()
                        },
                        shippingcost:{
                          N: product.shipping_cost.toString()
                        },
                        
                        deliverydate:{
                          S: product.delivery_date
                        },
                    }
                }))
            }

        }
    };

    await client.send(
        new PutItemCommand(params)
    );

    console.log("sending to sns");


    const message = {
        orderid,
        userid,
        products,
        ordertotal,
        status: "PLACED",
        orderplaceddate
      };
      
      console.log("SNS Message:");
      console.log(message);
      
      console.log("SNS Message (JSON):");
      console.log(JSON.stringify(message));
    await snsClient.send(
        new PublishCommand({
          TopicArn: process.env.SNS_TOPIC_ARN,
          Subject: "Order Placed",
          Message: JSON.stringify(message)
        })
      );

      console.log("finished sending to sns");

      const cartItems = await client.send(
        new QueryCommand({
            TableName: "Ricemill_carts_cdk",
            KeyConditionExpression: "user_id = :userid",
            ExpressionAttributeValues:{
                ":userid":{
                    S: userid
                }
            }
        })
    );


    const deleteRequests = cartItems.Items.map(item => ({
        DeleteRequest:{
            Key:{
                user_id:{
                    S:item.user_id.S
                },
                product_id:{
                    S:item.product_id.S
                }
            }
        }
    }));


    await client.send(
        new BatchWriteItemCommand({
            RequestItems:{
                "Ricemill_carts_cdk": deleteRequests
            }
        })
    );


    res.status(200).json({
      orderid: orderid,
      message:"Ordered Successfully"

  });

        

}

   catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 

module.exports = router; 