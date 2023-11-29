function updateData(playerId, field, element) {
  const value = element.innerText.trim();
  const data = JSON.parse(localStorage.getItem("callBreakData")) || {};

  if (!data[playerId]) {
    data[playerId] = {};
  }

  data[playerId][field] = value;
  localStorage.setItem("callBreakData", JSON.stringify(data));
}

function handleKeyPress(event, nextPlayerId, fieldName) {
  if (event.key === "Enter") {
    event.preventDefault();
    const nextPlayerElement = document
      .getElementById(nextPlayerId)
      .querySelector(`[contenteditable="true"][oninput*="${fieldName}"]`);
    if (nextPlayerElement) {
      nextPlayerElement.focus();
    }
  }
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("callBreakData")) || {};

  for (let playerId in data) {
    for (let field in data[playerId]) {
      const element = document
        .getElementById(playerId)
        .querySelector(`[contenteditable="true"][oninput*="${field}"]`);
      if (element) {
        element.innerText = data[playerId][field];
      }
    }
  }
}

function resetData() {
  const isConfirmed = confirm("Are you sure you want to reset the game?");
  if (isConfirmed) {
    localStorage.removeItem("callBreakData");
    const editableElements = document.querySelectorAll(
      '[contenteditable="true"]'
    );
    editableElements.forEach((element) => {
      element.innerText = "";
    });
  }
}

function endGame() {
  const data = JSON.parse(localStorage.getItem("callBreakData")) || {};

  const totalPoints = {};
  for (let playerId in data) {
    totalPoints[playerId] = 0;
    for (let field in data[playerId]) {
      if (field === "points") {
        const points = data[playerId][field].split(/\s*\+\s*/);
        for (let p of points) {
          const individualPoints = p.split(/\s*\-\s*/).map(Number);

          if (individualPoints.length > 1) {
            totalPoints[playerId] -= individualPoints
              .slice(1)
              .reduce((a, b) => a + b, 0);
          }
          totalPoints[playerId] += individualPoints[0];
        }
      }
    }
  }

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  modalContent.innerHTML = "<h2>Results:</h2>";

  for (let playerId in totalPoints) {
    modalContent.innerHTML += `<p>${data[playerId].name}: ${totalPoints[playerId]} points</p>`;
  }

  const winner = Object.keys(totalPoints).reduce((a, b) =>
    totalPoints[a] > totalPoints[b] ? a : b
  );

  modalContent.innerHTML += `<h3>Winner: <span class="winner-name">${data[winner].name}</span></h3>`;

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

document.addEventListener("DOMContentLoaded", loadData);
