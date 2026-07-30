const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb") ;
const router = express.Router();


const client = new DynamoDBClient({
    region: "us-east-1"
});

router.get("/", async (req,res) => {
console.log(req);
console.log(req.body);



  try {
    const result =  await client.send(
      new ScanCommand
      ({
          TableName: "Ricemill_products_cdk"
      })
      
  ); //returned result will be JSON object so we need to stringify it 


      res.status(201).json({
        message:"Products fetched",
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