import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const port  = process.env.PORT || 3001;


  app.use(cors({
    origin: ['http://localhost:3000', 'https://luxxcloth.web.app'],
    methods:['GET'],
    allowedHeaders:['Content-Type']
  }));


  app.use(express.json());

  app.get('/api/track', async (req,res)=>{
    const {trackingNumber, courier} = req.query;
    if(!trackingNumber){
      return res.status(400).json({
        meta: {
          code: 400,
          message: 'Tracking number is required'
        }

      });
    }





    try {
      const response = await axios.get(
        `https://api.aftership.com/v4/trackings/${courier}/${trackingNumber}`,
        {
          headers:{
            'aftership-api-key': process.env.AFTERSHIP_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );





      res.status(200).json(response.data);

    }catch(error){
      console.error('AfterShip API ERROR:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        meta:{
          code: error.response?.status || 500,
          message: error.response?.data?.meta?.message || 'Failed to fetch tracking data'
        }
      });
    }
  });

  app.listen(port, () =>{
    console.log('Server started on http://localhost: ${port}');
  })