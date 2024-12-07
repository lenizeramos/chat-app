$(function () {
    var postData = function (url, method, data) {
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
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        var searchedUserId = Number($("#searchUserInput").val());
        if (searchedUserId) {
            postData("/chat/direct", "POST", { id: searchedUserId });
        } /* else {
          $("#error-message")
            .removeClass("d-none")
            .html("Please enter an username!");
        } */
    });
    var socket = io({ query: { username: username } });
    var currentRoom = null;
    var $messageInput = $(".messageInput");
    var $sendButton = $(".sendButton");
    var $messagesDiv = $(".messages");
    var $joinRoomButton = $(".joinRoomButton");
    var $leaveRoomButton = $(".leaveRoomButton");
    var $currentRoomDisplay = $(".currentRoom");
    $joinRoomButton.on("click", function (e) {
        var target = $(e.currentTarget);
        var room = target.data("chat-id");
        var chatName = target.data("chat-name");
        console.log(room);
        //const room = $roomSelect.val() as string;
        if (currentRoom) {
            socket.emit("leaveRoom", currentRoom);
        }
        socket.emit("joinRoom", room);
        currentRoom = room;
        $currentRoomDisplay.text(chatName);
        $messagesDiv.empty();
    });
    $leaveRoomButton.on("click", function () {
        if (currentRoom) {
            socket.emit("leaveRoom", currentRoom);
            currentRoom = null;
            $currentRoomDisplay.text("NO ROOMS");
            $messagesDiv.empty();
        }
    });
    $sendButton.on("click", function () {
        var message = $messageInput.val();
        if (currentRoom && message) {
            socket.emit("message", { room: currentRoom, message: message });
            $messageInput.val("");
        }
    });
    socket.on("previousMessages", function (messages) {
        messages.forEach(function (_a) {
            var id = _a.id, message = _a.message;
            var $messageElement = $("<div>").text("".concat(id, ": ").concat(message));
            $messagesDiv.append($messageElement);
        });
    });
    socket.on("message", function (_a) {
        var id = _a.id, message = _a.message;
        var $messageElement = $("<div>").text("".concat(id, ": ").concat(message));
        $messagesDiv.append($messageElement);
    });
});
