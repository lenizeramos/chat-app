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
    var selectedUserId = null;

    $searchInput.on("input", function() {
        clearTimeout(searchTimeout);
        selectedUserId = null; // Clear selected user when input changes
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
                        var initials = user.username.substring(0, 2).toUpperCase();
                        var avatarHtml = user.avatar 
                            ? `<img src="${user.avatar}" class="avatar-img" alt="${user.username}'s avatar">` 
                            : `<div class="avatar-initials">${initials}</div>`;

                        return `
                            <div class="search-result p-2 hover-bg-light cursor-pointer d-flex align-items-center" data-user-id="${user.id}" data-username="${user.username}">
                                <div class="avatar rounded-circle text-white text-center me-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: #007bff;">
                                    ${avatarHtml}
                                </div>
                                <span>${user.username}</span>
                            </div>`;
                    }).join("");

                    $searchResults.html(resultsHtml).removeClass("d-none");
                })
                .fail(function(error) {
                    console.error("Search failed:", error);
                });
        }, 300);
    });

    // Handle search result selection
    $(document).on("click", ".search-result", function() {
        var userId = $(this).data("user-id");
        var username = $(this).data("username");
        selectedUserId = userId;
        $searchInput.val(username);
        $searchResults.addClass("d-none");
        postData("/chat/direct", "POST", { id: userId });
    });

    // Handle search form submission
    $("#searchForm").on("submit", function(e) {
        e.preventDefault();
        if (selectedUserId) {
            postData("/chat/direct", "POST", { id: selectedUserId });
        }
        // If no user is selected, do nothing
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
            var initials = username.substring(0, 2).toUpperCase();
            var $messageElement = $("<div>").addClass("message-item d-flex align-items-start mb-2");
            
            var $avatar = $("<div>")
                .addClass("avatar rounded-circle text-white text-center me-2 d-flex align-items-center justify-content-center")
                .css({
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#007bff",
                    fontSize: "12px"
                })
                .text(initials);

            var $messageContent = $("<div>")
                .addClass("message-content")
                .append($("<strong>").text(username + ": "))
                .append($("<span>").text(content));

            $messageElement.append($avatar).append($messageContent);
            $messagesDiv.append($messageElement);
        });
        
        // Scroll to bottom after adding messages
        $messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    });

    socket.on("message", function (_a) {
        var id = _a.id, message = _a.message;
        var initials = id.substring(0, 2).toUpperCase();
        var $messageElement = $("<div>").addClass("message-item d-flex align-items-start mb-2");
        
        var $avatar = $("<div>")
            .addClass("avatar rounded-circle text-white text-center me-2 d-flex align-items-center justify-content-center")
            .css({
                width: "32px",
                height: "32px",
                backgroundColor: "#007bff",
                fontSize: "12px"
            })
            .text(initials);

        var $messageContent = $("<div>")
            .addClass("message-content")
            .append($("<strong>").text(id + ": "))
            .append($("<span>").text(message));

        $messageElement.append($avatar).append($messageContent);
        $messagesDiv.append($messageElement);
        
        // Scroll to bottom after adding new message
        $messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    });
});
