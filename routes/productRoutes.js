const express = require("express");
//we need authenticate the token before sending the request to endpoint right ? 
const { DynamoDBClient, ScanCommand,GetItemCommand } = require("@aws-sdk/client-dynamodb") ;
const router = express.Router();


const client = new DynamoDBClient({
    region: "us-east-1"
});

router.get("/", async (req,res) => {

  try {
    const result =  await client.send(
      new ScanCommand
      ({
          TableName: "Ricemill_products_cdk"
      })
      
  ); //returned result will be JSON object so we need to stringify it 


  res.status(200).json(result.Items);


  } catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 


//----------------------------------------------------------------------------------------//
router.post("/", async (req,res) => {

  try {


    const productid = req.body.productid.S;
    console.log(productid)


    const result = await client.send(
        new GetItemCommand
            ({
                TableName: "Ricemill_products_cdk",
                Key: {
                    prod_id: { S: productid }
                }
            })
    ); //returned result will be JSON object so we need to stringify it 


  res.status(200).json(result.Item);


  } catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 



//----------------------------------------------------------------------------------------//
router.get("/:productid", async (req,res) => {
  const productid = req.params.productid;

  try {
    const result = await client.send(
      new GetItemCommand({
          TableName: "Ricemill_products_cdk",
          Key: {
              prod_id: {
                  S: productid 
              }
          }
      })
  );


  res.status(200).json(result.Item);


  } catch (error) {

      console.error(error);

      res.status(500).json({

        message:error.message

    });
     
  }
 
}) ; 











module.exports = router;