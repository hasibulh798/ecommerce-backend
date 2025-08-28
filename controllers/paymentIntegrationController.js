import SSLCommerzPayment from "sslcommerz-lts";

//ssl commerz config
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWD;
const is_live = false; // true for live, false for sandbox

// Controller
export const paymentIntegrationController = async (req, res) => {
  const { name, email, phone, totalAmount } = req.body;

  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: "tran_" + Date.now(), // unique transaction id
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer",
    product_category: "Electronic",
    product_profile: "general",

    // customer info
    cus_name: name,
    cus_email: email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: phone,
    cus_fax: "01711111111",

    // shipping info
    ship_name: name,
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      return res.status(200).json({
        success: true,
        url: apiResponse.GatewayPageURL,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment session init failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment integration error",
      error: error.message,
    });
  }
};
