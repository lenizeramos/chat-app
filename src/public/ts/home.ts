declare const io: any;
declare const userEmail: string;

$(() => {
  const postData = (url: string, method: string, data?: any) => {
    $.ajax({
      url: url,
      method: method,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        window.location.reload();
      },
      error: function (xhr, status, error) {
        console.log("Error: ", status, error, xhr.responseText);
      },
    });
  };
  $("#searchForm").on("submit", (e) => {
    e.preventDefault();
    const searchedUserId = Number($("#searchUserInput").val())
    if (searchedUserId) {
      postData("/chat/direct", "POST", { id: searchedUserId });
    } /* else {
      $("#error-message")
        .removeClass("d-none")
        .html("Please enter a todo description!");
    } */
  });

  const socket = io({ query: { userEmail } });

  let currentRoom: string | null = null;

  const $messageInput = $("#messageInput") as JQuery<HTMLInputElement>;
  const $sendButton = $("#sendButton");
  const $messagesDiv = $("#messages");
  const $roomSelect = $("#roomSelect") as JQuery<HTMLSelectElement>;
  const $joinRoomButton = $("#joinRoomButton");
  const $leaveRoomButton = $("#leaveRoomButton");
  const $currentRoomDisplay = $("#currentRoom");

  $joinRoomButton.on("click", () => {
    const room = $roomSelect.val() as string;
    if (currentRoom) {
      socket.emit("leaveRoom", currentRoom);
    }
    socket.emit("joinRoom", room);
    currentRoom = room;
    $currentRoomDisplay.text(room);
    $messagesDiv.empty();
  });

  $leaveRoomButton.on("click", () => {
    if (currentRoom) {
      socket.emit("leaveRoom", currentRoom);
      currentRoom = null;
      $currentRoomDisplay.text("NO ROOMS");
      $messagesDiv.empty();
    }
  });

  $sendButton.on("click", () => {
    const message = $messageInput.val() as string;
    if (currentRoom && message) {
      socket.emit("message", { room: currentRoom, message });
      $messageInput.val("");
    }
  });

  socket.on(
    "previousMessages",
    (messages: { id: string; message: string }[]) => {
      messages.forEach(({ id, message }) => {
        const $messageElement = $("<div>").text(`${id}: ${message}`);
        $messagesDiv.append($messageElement);
      });
    }
  );

  socket.on("message", ({ id, message }: { id: string; message: string }) => {
    const $messageElement = $("<div>").text(`${id}: ${message}`);
    $messagesDiv.append($messageElement);
  });
});
