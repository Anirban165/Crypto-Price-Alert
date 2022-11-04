const axios = require("axios");

module.exports = async (alert, currentPrice) => {
  try {
    const config = {
      method: "post",
      url: "https://graph.facebook.com/v14.0/102265355853439/messages",
      headers: {
        Authorization:
          "Bearer " + process.env.WHATSAPP_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: "91" + alert.mobile,
        type: "template",
        template: {
          name: "alerts_down",
          language: { code: "en_US", policy: "deterministic" },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: `⚠️ ${alert.coin} ${
                    alert.type == "above" ? "UP 📈 !!" : " DOWN 📉 !!"
                  }`,
                },
              ],
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: alert.coin },
                {
                  type: "text",
                  text: alert.type == "above" ? "exceeded" : "fell below",
                },
                { type: "text", text: alert.price },
                { type: "text", text: currentPrice },
              ],
            },
          ],
        },
      },
    };

    const {
      data: {
        contacts: [{ wa_id }],
      },
    } = await axios(config);
    console.log("WhatsApp Sent to ->", wa_id);
  } catch (error) {
    console.log("Error Sending WhatsApp.", error.message);
  }
};
