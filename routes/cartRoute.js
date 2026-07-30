const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb") ;
const router = express.Router();


const client = new DynamoDBClient({
    region: "us-east-1"
});

router.post("/", async (req,res) => {
console.log(req);
console.log(req.body);



  try {
    const result =  await client.send(
      new QueryCommand
          ({
              TableName: "Ricemill_carts_cdk",
              KeyConditionExpression: "user_id = :userid",
              ExpressionAttributeValues: {
                  ":userid": { S: userid }
              }

          })

     )

      res.status(201).json({
        message:"Cart count fetched",
        userid:sub
    });


  } catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 

module.exports = router;