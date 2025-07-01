import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: '388b9ebcb2b505c211a32a71f0af6e7b-us14',
  server: 'us14',
});

async function sendNewsletter() {
  try {
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: {
        list_id: 'e5bfbb986b',
      },
      settings: {
        subject_line: 'Latest Fashion Updates',
        preview_text: 'New collections, exclusive offers!',
        from_name: 'luxxcloth fasion team',
        reply_to: 'srisailochan@gmail.com',
        title: 'Fashion Newsletter ' + new Date().toISOString(),
      },
    });

    await mailchimp.campaigns.setContent(campaign.id, {
      html: `
        <h1>Latest Fashion Updates</h1>
        <p>Hello,</p>
        <p>Check out our latest offerings:</p>
        <ul>
          <li><a href="https://luxxcloth.web.app/collections">New Arrivals</a></li>
          <li>Exclusive Offer: 20% off with code FASHION20</li>
          <li><a href="https://luxxcloth.web.app/styling-tips">Styling Tips</a></li>
        </ul>
        <p>Best,<br>Your Fashion Team</p>
      `,
    });

    await mailchimp.campaigns.send(campaign.id);
    console.log('Newsletter sent successfully');
  } catch (error) {
    console.error('Error sending newsletter:', error);
  }
}

sendNewsletter();