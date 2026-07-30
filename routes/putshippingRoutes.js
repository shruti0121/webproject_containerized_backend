const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const { DynamoDBClient,UpdateItemCommand } = require("@aws-sdk/client-dynamodb") ;

const router = express.Router();
const client = new DynamoDBClient({
    region: "us-east-1"
});

router.post("/", async (req,res) => {

  const userid = req.body.sub;
  const productid = req.body.product_id;
  try{
    const result =  await client.send(
      new UpdateItemCommand({
        TableName: "Ricemill_carts_cdk",
        Key: {
            user_id: { S: userid },
            product_id: { S: productid }
        },
        UpdateExpression: "SET shipping_cost = :shippingCost, delivery_date = :deliveryDate",
        ExpressionAttributeValues: {
          ":shippingCost": { N: cost.toString() },
          ":deliveryDate": { S: date }
        },
      
      ReturnValues:"ALL_NEW"
    })
  
     )
    
       res.status(200).json({
  
        message:"put Shipping"
  
    });

  }  catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 

module.exports = router;