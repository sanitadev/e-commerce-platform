const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

exports.createPayment = async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    const create_payment_json = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: 'http://localhost:4200/payment/success',
        cancel_url: 'http://localhost:4200/payment/cancel'
      },
      transactions: [{
        amount: { currency: 'USD', total: amount },
        description: description
      }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        res.status(500).json({ error: error.response });
      } else {
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
        res.json({ approvalUrl: approvalUrl.href, paymentId: payment.id });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.executePayment = async (req, res) => {
  try {
    const { paymentId, PayerID } = req.body;
    
    const execute_payment_json = {
      payer_id: PayerID
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        res.status(500).json({ error: error.response });
      } else {
        res.json({ payment });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};