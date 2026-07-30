const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const { DynamoDBClient,DeleteItemCommand } = require("@aws-sdk/client-dynamodb") ;

const router = express.Router();
const client = new DynamoDBClient({
    region: "us-east-1"
});

router.post("/", async (req,res) => {


  const userid = req.body.sub;
  const productid = req.body.product_id;


  try {
    const result =  await client.send(
     new DeleteItemCommand
         ({
             TableName: "Ricemill_carts_cdk",
             Key: {
                 user_id: { S: userid },
                 product_id: { S: productid }
             }
         })  

    )

     res.status(200).json({

      message:"Deleted Successfully"

  });


  } catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 

module.exports = router;