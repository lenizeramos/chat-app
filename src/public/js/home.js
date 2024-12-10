/// <reference types="jquery" />
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
<<<<<<< Upstream, based on origin/julio
    // Search functionality
    var $searchInput = $("#searchUserInput");
    var $searchResults = $("#searchResults");
    var searchTimeout;
    var selectedUserId = null;
    $searchInput.on("input", function () {
        var _a;
        clearTimeout(searchTimeout);
        selectedUserId = null; // Clear selected user when input changes
        var searchTerm = ((_a = $(this).val()) === null || _a === void 0 ? void 0 : _a.toString().trim()) || "";
        if (searchTerm === "") {
            $searchResults.addClass("d-none").empty();
            return;
        }
        searchTimeout = setTimeout(function () {
            $.get("/search-users?search=" + encodeURIComponent(searchTerm))
                .done(function (users) {
                if (users.length === 0) {
                    $searchResults.addClass("d-none").empty();
                    return;
                }
                var resultsHtml = users.map(function (user) {
                    var initials = user.username.substring(0, 2).toUpperCase();
                    var avatarHtml = user.avatar
                        ? "<img src=\"".concat(user.avatar, "\" class=\"avatar-img\" alt=\"").concat(user.username, "'s avatar\">")
                        : "<div class=\"avatar-initials\">".concat(initials, "</div>");
                    return "\n                            <div class=\"search-result p-2 hover-bg-light cursor-pointer d-flex align-items-center\" data-user-id=\"".concat(user.id, "\" data-username=\"").concat(user.username, "\">\n                                <div class=\"avatar rounded-circle text-white text-center me-3 d-flex align-items-center justify-content-center\" style=\"width: 32px; height: 32px; background-color: #007bff;\">\n                                    ").concat(avatarHtml, "\n                                </div>\n                                <span>").concat(user.username, "</span>\n                            </div>");
                }).join("");
                $searchResults.html(resultsHtml).removeClass("d-none");
            })
                .fail(function (error) {
                console.error("Search failed:", error);
            });
        }, 300);
    });
    // Handle search result selection
    $(document).on("click", ".search-result", function () {
        var userId = $(this).data("user-id");
        var username = $(this).data("username");
        selectedUserId = userId;
        $searchInput.val(username);
        $searchResults.addClass("d-none");
        postData("/chat/direct", "POST", { id: userId });
    });
    // Handle search form submission
=======
>>>>>>> 5af9b7f add prisma to homeController and removed chat from home.ejs
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
<<<<<<< Upstream, based on origin/julio
    // Hide search results when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".search-container").length) {
            $searchResults.addClass("d-none");
        }
    });
=======
>>>>>>> 5af9b7f add prisma to homeController and removed chat from home.ejs
    var socket = io({ query: { username: usernameLogged } });
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
<<<<<<< Upstream, based on origin/julio
=======
    $(".attach-file").on("change", function (e) { return __awaiter(_this, void 0, void 0, function () {
        var fileInput, file, formData, response, fileUrl, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileInput = e.target;
                    file = (_a = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file) return [3 /*break*/, 6];
                    formData = new FormData();
                    formData.append("attach-file", file);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/chat/upload", {
                            method: "POST",
                            body: formData,
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    fileUrl = (_b.sent()).fileUrl;
                    socket.emit("message", {
                        room: currentRoom,
                        message: "",
                        fileUrl: fileUrl,
                    });
                    _b.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error("File upload failed:", error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
>>>>>>> 5af9b7f add prisma to homeController and removed chat from home.ejs
    socket.on("previousMessages", function (messages) {
        messages.forEach(function (_a) {
<<<<<<< Upstream, based on origin/julio
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
=======
            var username = _a.username, content = _a.content, imageUrl = _a.imageUrl;
            displayMessage(username, content, imageUrl);
        });
    });
    socket.on("message", function (_a) {
        var username = _a.username, message = _a.message, fileUrl = _a.fileUrl;
        displayMessage(username, message, fileUrl);
    });
    var displayMessage = function (username, message, fileUrl) {
        var $messageElement;
        if (usernameLogged === username) {
            $messageElement = $("<div>")
                .addClass("messages p-2 mb-2 message-logged-user rounded border")
                .text("".concat(username, ": ").concat(message || ""));
        }
        else {
            $messageElement = $("<div>")
                .addClass("messages p-2 mb-2 message-other-user rounded border")
                .text("".concat(username, ": ").concat(message || ""));
        }
        if (fileUrl) {
            var isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl);
            if (isImage) {
                var $fileElement = $("<img>")
                    .attr("src", fileUrl)
                    .attr("alt", "Image sent")
                    .addClass("img-thumbnail mt-2");
                $messageElement.append($fileElement);
            }
            else {
                var $fileLink = $("<a>")
                    .attr("href", fileUrl)
                    .attr("target", "_blank")
                    .text("Click here to download the file")
                    .addClass("file-link d-block mt-2 text-primary");
                $messageElement.append($fileLink);
            }
        }
>>>>>>> 5af9b7f add prisma to homeController and removed chat from home.ejs
        $messagesDiv.append($messageElement);
<<<<<<< Upstream, based on origin/julio
        // Scroll to bottom after adding new message
        $messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    });
=======
        //$messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    };
>>>>>>> 5af9b7f add prisma to homeController and removed chat from home.ejs
});
