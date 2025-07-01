const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const mailchimp = require('@mailchimp/mailchimp_marketing');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

mailchimp.setConfig({
  apiKey: functions.config().mailchimp.api_key,
  server: functions.config().mailchimp.server_prefix
});

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await mailchimp.lists.addListMember(functions.config().mailchimp.audience_id, {
      email_address: email,
      status: 'subscribed' // Fixed typo
    });

    await db.collection('subscribers').doc(email).set({
      email,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
    if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
      return res.status(400).json({ error: 'You are already subscribed to our newsletter' });
    }

    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

exports.api = functions.https.onRequest(app); // Changed export to match firebase.json rewrite