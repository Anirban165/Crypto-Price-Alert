async function updatePrice() {
  try {
    const {
      data: { data },
    } = await axios.get("/api/coin-prices");
    for (let coin in data) {
      let selector = $("#" + coin.replace("USDT", "").toLowerCase());
      let lastPrice = selector.text().replace("$ ", "");
      let price = data[coin];
      selector.html("$ " + price).fadeIn("slow");
      selector
        .css(
          "color",
          !lastPrice || lastPrice === price
            ? "#2e3338"
            : price > lastPrice
            ? "#05b540"
            : "#ED4C67"
        )
        .fadeIn("slow");
      setTimeout(() => {
        selector.css("color", "#2e3338").fadeIn("slow");
        lastPrice = price;
      }, 2000);
    }
  } catch (error) {
    console.log(error);
  }
}

function changeSelected(coin) {
  $("#coinSelect option[value=" + $("#coinSelect").val() + "]").removeAttr(
    "selected",
    "selected"
  );
  $("#coinSelect option[value=" + coin + "USDT]").attr("selected", "selected");
  updateLabelPrice();
}

function updateLabelPrice() {
  var coin = $("#coinSelect").val().replace("USDT", "").toLowerCase();
  $("#priceHelp").text("Current Price : " + $("#" + coin).text());
  $("#type").css("marginTop", "16px");
}

async function saveAlert() {
  try {
    const data = {
      coin: $("#coinSelect").val(),
      price: $("#InputPrice").val(),
      type: $("#type").val(),
      mobile: $("#mobile_no").val(),
      call: $("#voice").prop("checked"),
      sms: $("#sms").prop("checked"),
      whatsapp: $("#whatsapp").prop("checked")
    };
    const { data: response } = await axios.post("/api/create-alert", data);
    return response;
  } catch (error) {
    return error.response.data;
  }
}

async function deleteAlert(id) {
  try {
    const { data } = await axios.delete(`api/delete-alerts/${id}`);
    $(".alert").addClass("alert-success").toast("show").css("display", "flex").html(data.message);
    $("#tableData").html("");
    await printAlertTable();
  } catch (error) {
    $(".alert").addClass("alert-danger").toast("show").css("display", "flex").html(error.response.data.message);
    console.log(error);
  }
}

async function printAlertTable() {
  try {
    const {
      data: { data: alerts },
    } = await axios.get("api/alerts");
    if (alerts.length === 0) {
      $(".table").html("No Alerts Found.").css("fontSize", "16px");
      return;
    }
    $("#tableData").append("<tbody>");
    alerts.forEach((alert, index) => {
      $("#tableData").append(`
      <tr>
        <td>${index + 1}</td>
        <td>${alert.coin}</td>
        <td>${alert.price}</td>
        <td>${
          alert.type == "above"
            ? '<i class="fa-solid fa-arrow-trend-up"></i>'
            : '<i class="fa-solid fa-arrow-trend-down"></i>'
        }</td>
        <td>${alert.mobile}</td>
        <td>${
          alert.call === true
            ? '<i class="fa-solid fa-check "></i>'
            : '<i class="fa-solid fa-xmark"></i>'
        }</td>
        <td>${
          alert.sms === true
            ? '<i class="fa-solid fa-check "></i>'
            : '<i class="fa-solid fa-xmark"></i>'
        }</td>
        <td>${
          alert.whatsapp === true
            ? '<i class="fa-solid fa-check "></i>'
            : '<i class="fa-solid fa-xmark"></i>'
        }</td>
        <td class="d-none d-lg-block">${new Date(
          alert.createdAt
        ).toLocaleString()}</td>
        <td><i class="fa fa-trash" aria-hidden="true" style="color:#e74c3c" onclick ="deleteAlert('${alert._id}');"></i></td>
      </tr>
    `);
      $("#tableData").append("</tbody>");
    });
  } catch (error) {
    $(".alert").addClass("alert-danger").toast("show").css("display", "flex").html(error.response.data.message);
    console.log(error);
  }
}
