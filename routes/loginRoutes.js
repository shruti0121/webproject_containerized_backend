const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb") ;
const router = express.Router();


const client = new DynamoDBClient({
    region: "us-east-1"
});

router.post("/", async (req,res) => {
console.log(req);
console.log(req.body);



  try {
      const sub =  req.body.sub ;

      const username = req.body.username;


      const params = {

          TableName: "Ricemill_user_cdk",

          Item: {

              user_id: {
                  S: sub
              },

              username: {
                  S: username
              }

          }
      };


      await client.send(
          new PutItemCommand(params)
      );


      res.status(201).json({
        message:"User created",
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