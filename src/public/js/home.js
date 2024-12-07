$(function () {
    var socket = io({ query: { userEmail: userEmail } });
    var currentRoom = null;
    var $messageInput = $("#messageInput");
    var $sendButton = $("#sendButton");
    var $messagesDiv = $("#messages");
    var $roomSelect = $("#roomSelect");
    var $joinRoomButton = $("#joinRoomButton");
    var $leaveRoomButton = $("#leaveRoomButton");
    var $currentRoomDisplay = $("#currentRoom");
    $joinRoomButton.on("click", function () {
        var room = $roomSelect.val();
        if (currentRoom) {
            socket.emit("leaveRoom", currentRoom);
        }
        socket.emit("joinRoom", room);
        currentRoom = room;
        $currentRoomDisplay.text(room);
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
