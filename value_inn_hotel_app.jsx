<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Value Inn Motel Management</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; font-size: 20px; }
    .hidden { display: none; }
    .room, .customer-info { margin-top: 10px; border: 1px solid #ccc; padding: 10px; font-size: 18px; }
    label { display: block; margin-top: 5px; font-size: 18px; }
    button { margin-top: 10px; font-size: 18px; }
    select, input { font-size: 18px; }
    #idPreview, #signaturePreview { margin-top: 10px; max-width: 200px; display: block; }
    #taxDetails { margin-top: 10px; }
    .menu-buttons { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
    .menu-buttons button { font-size: 18px; padding: 10px; }
  </style>
</head>
<body>
  <h1>Value Inn Motel Management</h1>

  <div id="login">
    <h3>Login</h3>
    <label>Username: <input type="text" id="username"></label>
    <label>Password: <input type="password" id="password"></label>
    <button onclick="login()">Login</button>
    <p id="loginMessage"></p>
  </div>

  <div id="app" class="hidden">
    <div class="menu-buttons">
      <button onclick="selectSection('rooms')">View All Rooms</button>
      <button onclick="selectSection('update')">Update Room Cleanliness</button>
      <button onclick="selectSection('availability')">Update Room Availability</button>
      <button onclick="selectSection('availableRooms')">Available Rooms</button>
      <button onclick="selectSection('reserve')">Reserve Room</button>
      <button onclick="selectSection('reservations')">View Reservations</button>
      <button onclick="selectSection('find')">Find Customer</button>
      <button onclick="selectSection('status')">Customer Status</button>
      <button onclick="selectSection('checkout')">Check Out Customer</button>
    </div>

    <div id="reserve" class="hidden">
      <h3>Reserve a Room</h3>
      <label>Name: <input type="text" id="custName"></label>
      <label>Address: <input type="text" id="custAddress"></label>
      <label>Stay Duration:
        <select id="custDuration">
          <option value="">None</option>
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
          <option value="3 hours">3 hours</option>
          <option value="4 hours">4 hours</option>
          <option value="5 hours">5 hours</option>
          <option value="1 night">1 night</option>
          <option value="2 nights">2 nights</option>
        </select>
      </label>
      <label>Days: <input type="number" id="custDays" min="1"></label>
      <label>Payment Method:
        <select id="custPayment">
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </label>
      <label>Room Price (before tax): <input type="number" id="custPrice"></label>
      <label>Room ID: <input type="number" id="custRoomId" min="1" max="14"></label>
      <label>Require Security Deposit:
        <button type="button" onclick="toggleDeposit(true)">Deposit</button>
        <button type="button" onclick="toggleDeposit(false)">No Deposit</button>
      </label>
      <label id="depositInput" class="hidden">Security Deposit: <input type="number" id="custDeposit"></label>
      <button onclick="reserveRoom()">Capture ID & Reserve</button>
      <p id="reserveStatus"></p>
      <img id="idPreview" class="hidden" />
      <img id="signaturePreview" class="hidden" />
      <div id="taxDetails"></div>
    </div>
  </div>

  <script>
    function selectSection(id) {
      const sections = document.querySelectorAll("#app > div");
      sections.forEach(s => s.classList.add("hidden"));
      document.getElementById(id).classList.remove("hidden");
    }

    function openCameraAndCaptureImage(callback) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = () => {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => callback(reader.result);
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }

    function reserveRoom() {
      const id = parseInt(document.getElementById("custRoomId").value);
      const room = rooms.find(r => r.id === id && !r.reserved);
      if (!room) {
        document.getElementById("reserveStatus").textContent = "Room not available.";
        return;
      }

      openCameraAndCaptureImage(idImage => {
        document.getElementById("idPreview").src = idImage;
        document.getElementById("idPreview").classList.remove("hidden");

        openCameraAndCaptureImage(signature => {
          document.getElementById("signaturePreview").src = signature;
          document.getElementById("signaturePreview").classList.remove("hidden");

          const name = document.getElementById("custName").value;
          const address = document.getElementById("custAddress").value;
          const duration = document.getElementById("custDuration").value;
          const days = parseInt(document.getElementById("custDays").value);
          const payment = document.getElementById("custPayment").value;
          const price = parseFloat(document.getElementById("custPrice").value);
          const deposit = parseFloat(document.getElementById("custDeposit").value || "0");
          const tax = payment === "Credit Card" ? 0.14 * price : 0;
          const total = price + tax;

          document.getElementById("taxDetails").innerHTML =
            `<p>Price Before Tax: $${price.toFixed(2)}</p>` +
            `<p>Tax: $${tax.toFixed(2)}</p>` +
            `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;

          alert(`Customer has paid. Total (with tax): $${total.toFixed(2)} | Security Deposit: $${deposit}`);

          room.reserved = true;
          room.customer = {
            name, address, duration, days, payment,
            tax: `${tax.toFixed(2)}`,
            price: price.toFixed(2),
            deposit: deposit.toFixed(2),
            notes: "", idScan: idImage, signature
          };

          document.getElementById("reserveStatus").textContent = `Room ${id} reserved.`;
          listRooms();
        });
      });
    }
  </script>
</body>
</html>
