import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/disasters', async (req, res) => {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
  
      const url = `https://api.reliefweb.int/v1/disasters?appname=live-disaster-app&profile=list&limit=20&sort[]=date.created:desc`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data || !data.data) {
        return res.status(500).json({ error: 'Unexpected response from disaster API' });
      }
  
      // Filter recent disasters (within 7 days)
      let recentDisasters = data.data.filter(disaster => {
        const startDate = disaster.fields?.date?.created || disaster.fields?.date?.start;
        if (!startDate) return false;
  
        const start = new Date(startDate);
        return start >= sevenDaysAgo && start <= today;
      });
  
      // If none found, use latest 10 from the original data
      if (recentDisasters.length === 0) {
        console.log("No recent disasters in the last 7 days, falling back to latest ones.");
        recentDisasters = data.data.slice(0, 10);
      }
  
      const disasters = recentDisasters.map(disaster => {
        const name = disaster.fields.name;
        const date = disaster.fields.date?.created?.split('T')[0] || disaster.fields.date?.start?.split('T')[0];
        return `${name} - ${date}`;
      });
  
      res.json({ disasters });
  
    } catch (error) {
      console.error('Error fetching disasters:', error);
      res.status(500).json({ error: 'Failed to fetch disaster updates' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
