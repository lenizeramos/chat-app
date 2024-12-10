declare const io: any;
declare const usernameLogged: string;

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
    const searchedUserId = Number($("#searchUserInput").val());
    if (searchedUserId) {
      postData("/chat/direct", "POST", { id: searchedUserId });
    } /* else {
      $("#error-message")
        .removeClass("d-none")
        .html("Please enter an username!");
    } */
  });

  const socket = io({ query: { username: usernameLogged } });

  let currentRoom: string | null = null;

  const $messageInput = $(".messageInput") as JQuery<HTMLInputElement>;
  const $sendButton = $(".sendButton");
  const $messagesDiv = $(".messages");
  const $joinRoomButton = $(".joinRoomButton");
  const $leaveRoomButton = $(".leaveRoomButton");
  const $currentRoomDisplay = $(".currentRoom");

  $joinRoomButton.on("click", (e) => {
    const target = $(e.currentTarget);
    const room = target.data("chat-id");
    const chatName = target.data("chat-name");

    if (currentRoom) {
      socket.emit("leaveRoom", currentRoom);
    }
    socket.emit("joinRoom", room);
    currentRoom = room;
    $currentRoomDisplay.text(chatName);
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
  $(".attach-file").on("change", async (e) => {
    const fileInput = e.target as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("attach-file", file);

      try {
        const response = await fetch("/chat/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { fileUrl } = await response.json();

          socket.emit("message", {
            room: currentRoom,
            message: "",
            fileUrl,
          });
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  });

  socket.on(
    "previousMessages",
    (messages: { username: string; content: string; imageUrl: string }[]) => {
      messages.forEach(({ username, content, imageUrl }) => {
        displayMessage(username, content, imageUrl);
      });
    }
  );

  socket.on(
    "message",
    ({
      username,
      message,
      fileUrl,
    }: {
      username: string;
      message: string;
      fileUrl: string;
    }) => {
      displayMessage(username, message, fileUrl);
    }
  );
  const displayMessage = (
    username: string,
    message: string,
    fileUrl?: string
  ) => {
    let $messageElement;

    if (usernameLogged === username) {
      $messageElement = $("<div>")
        .addClass("messages p-2 mb-2 message-logged-user rounded border")
        .text(`${username}: ${message || ""}`);
    } else {
      $messageElement = $("<div>")
        .addClass("messages p-2 mb-2 message-other-user rounded border")
        .text(`${username}: ${message || ""}`);
    }

    if (fileUrl) {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl);

      if (isImage) {
        const $fileElement = $("<img>")
          .attr("src", fileUrl)
          .attr("alt", "Image sent")
          .addClass("img-thumbnail mt-2");
        $messageElement.append($fileElement);
      } else {
        const $fileLink = $("<a>")
          .attr("href", fileUrl)
          .attr("target", "_blank")
          .text("Click here to download the file")
          .addClass("file-link d-block mt-2 text-primary");
        $messageElement.append($fileLink);
      }
    }

    $messagesDiv.append($messageElement);

    //$messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
  };
});
