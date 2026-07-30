const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const { DynamoDBClient, GetItemCommand ,UpdateItemCommand } = require("@aws-sdk/client-dynamodb") ;

const router = express.Router();
const client = new DynamoDBClient({
    region: "us-east-1"
});

router.post("/", async (req,res) => {


  const userid = req.body.sub;
  const productid = req.body.product_id;


    try {
       const result =  await client.send(
        new UpdateItemCommand({
          TableName: "Ricemill_carts_cdk",
          Key: {
              user_id: { S: userid },
              product_id: { S: productid }
          },
          UpdateExpression:
          "SET quantity = if_not_exists(quantity, :zero) + :increment",
          
          ExpressionAttributeValues:{
            ":zero":{
                N:"0"
            },
            ":increment":{
                N:"1"
            }
        },
        
        ReturnValues:"ALL_NEW"
      })

       )
       console.log(result)



     res.status(200).json(result.Attributes);


  } catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 

module.exports = router;