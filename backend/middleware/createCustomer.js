const isValidEmailFormat = require("./isValidEmailFormat");
const { SHOPIFY_ADMIN_API_URL, ADMIN_API_TOKEN } = require('../keys.js');

const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          createdAt
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
        }
        userErrors {
          field
          message
        }
      }
    }
`;

const createCustomer = async (req, res) => {
  const { email } = req.body;

  console.log(email);

  // sanitize
  
  // Check regex
  let isValidEmail = isValidEmailFormat(email);
  
  if (!isValidEmail) return res.status(400).json({ userErrors: 'Not An Email.' });
  
  const variables = {
      input: {
        email: email,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: new Date().toISOString(),
        },
      },
  };
  
  try {
      const response = await fetch(SHOPIFY_ADMIN_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': ADMIN_API_TOKEN,
            },
            body: JSON.stringify({ query: mutation, variables }),
      });

      const data = await response.json();
  
      const { customerCreate } = data.data;
  
      // email prints as null ?? it is still uploaded to customers table.
      console.log(customerCreate);
  
      if (customerCreate?.userErrors.length > 0) {
        return res.status(400).json({ userErrors: customerCreate.userErrors });
      }
  
      return res.status(200).json({ success: true, customer: customerCreate.customer });
    } catch (err) {
      console.error('Admin API request failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = createCustomer