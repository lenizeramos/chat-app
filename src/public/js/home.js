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

    // Search functionality
    var $searchInput = $("#searchUserInput");
    var $searchResults = $("#searchResults");
    var searchTimeout;

    $searchInput.on("input", function() {
        clearTimeout(searchTimeout);
        var searchTerm = $(this).val().trim();

        if (searchTerm === "") {
            $searchResults.addClass("d-none").empty();
            return;
        }

        searchTimeout = setTimeout(function() {
            $.get("/search-users?search=" + encodeURIComponent(searchTerm))
                .done(function(users) {
                    if (users.length === 0) {
                        $searchResults.addClass("d-none").empty();
                        return;
                    }

                    var resultsHtml = users.map(function(user) {
                        return `<div class="search-result p-2 hover-bg-light cursor-pointer" data-user-id="${user.id}">
                            ${user.username}
                        </div>`;
                    }).join("");

                    $searchResults.html(resultsHtml).removeClass("d-none");
                })
                .fail(function(error) {
                    console.error("Search failed:", error);
                });
        }, 300);
    });

    // Handle search result click
    $(document).on("click", ".search-result", function() {
        var userId = $(this).data("user-id");
        postData("/chat/direct", "POST", { id: userId });
    });

    // Hide search results when clicking outside
    $(document).on("click", function(e) {
        if (!$(e.target).closest(".search-container").length) {
            $searchResults.addClass("d-none");
        }
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
            var username = _a.username, content = _a.content;
            var $messageElement = $("<div>").text("".concat(username, ": ").concat(content));
            $messagesDiv.append($messageElement);
        });
    });

    socket.on("message", function (_a) {
        var id = _a.id, message = _a.message;
        var $messageElement = $("<div>").text("".concat(id, ": ").concat(message));
        $messagesDiv.append($messageElement);
    });
});
