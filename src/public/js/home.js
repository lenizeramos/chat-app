/// <reference types="jquery" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
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
                var resultsHtml = users
                    .map(function (user) {
                    var initials = user.username.substring(0, 2).toUpperCase();
                    var avatarHtml = user.avatar
                        ? "<img src=\"".concat(user.avatar, "\" class=\"avatar-img\" alt=\"").concat(user.username, "'s avatar\">")
                        : "<div class=\"avatar-initials\">".concat(initials, "</div>");
                    return "\n                            <div class=\"search-result p-2 hover-bg-light cursor-pointer d-flex align-items-center\" data-user-id=\"".concat(user.id, "\" data-username=\"").concat(user.username, "\">\n                                <div class=\"avatar rounded-circle text-white text-center me-3 d-flex align-items-center justify-content-center\" style=\"width: 32px; height: 32px; background-color: #007bff;\">\n                                    ").concat(avatarHtml, "\n                                </div>\n                                <span>").concat(user.username, "</span>\n                            </div>");
                })
                    .join("");
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
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        if (selectedUserId) {
            postData("/chat/direct", "POST", { id: selectedUserId });
        }
        // If no user is selected, do nothing
    });
    // Hide search results when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".search-container").length) {
            $searchResults.addClass("d-none");
        }
    });
    var socket = io({ query: { username: usernameLogged } });
    var currentRoom = null;
    var $messageInput = $(".messageInput");
    var $sendButton = $(".sendButton");
    var $messagesDiv = $(".messages");
    var $joinRoomButton = $(".joinRoomButton");
    var $leaveRoomButton = $(".leaveRoomButton");
    var $currentRoomDisplay = $(".currentRoom");
    var $chatArea = $(".chat-area");
    var $chatPlaceholder = $(".chat-placeholder");
    var $createGroupButton = $("#createGroupButton");
    var $createGroupForm = $("#createGroupForm");
    var $contact = $("#contact");
    var $chatRoom = $("#chatRoom");
    var isMobileView = function () { return ($(window).width() || 0) <= 768; };
    var showOnlyContact = function () {
        $chatRoom.addClass("d-none");
        $contact.removeClass("d-none");
    };
    var showOnlyChatRoom = function () {
        $chatRoom.removeClass("d-none");
        $contact.addClass("d-none");
    };
    var showContactAndChatRoom = function () {
        $chatRoom.removeClass("d-none");
        $contact.removeClass("d-none");
    };
    if (isMobileView()) {
        showOnlyContact();
    }
    $(window).on("resize", function () {
        if (isMobileView()) {
            showOnlyContact();
        }
        else {
            showContactAndChatRoom();
        }
    });
    $createGroupButton.on("click", function () {
        if (isMobileView()) {
            showOnlyChatRoom();
        }
        $createGroupForm.removeClass("d-none");
        $chatPlaceholder.addClass("d-none");
        $chatArea.addClass("d-none");
    });
    $createGroupForm.on("submit", function (e) {
        e.preventDefault();
        if (isMobileView()) {
            showOnlyContact();
        }
        $createGroupForm.addClass("d-none");
        $chatPlaceholder.removeClass("d-none");
    });
    $joinRoomButton.on("click", function (e) {
        var target = $(e.currentTarget);
        var room = target.data("chat-id");
        var chatName = target.data("chat-name");
        if (isMobileView()) {
            showOnlyChatRoom();
        }
        $chatArea.removeClass("d-none");
        $chatPlaceholder.addClass("d-none");
        console.log(room);
        if (currentRoom) {
            socket.emit("leaveRoom", currentRoom);
        }
        socket.emit("joinRoom", room);
        currentRoom = room;
        $currentRoomDisplay.text(chatName);
        $chatArea.removeClass("d-none");
        $chatPlaceholder.addClass("d-none");
        $createGroupForm.addClass("d-none");
        $messagesDiv.empty();
    });
    $leaveRoomButton.on("click", function () {
        if (currentRoom) {
            socket.emit("leaveRoom", currentRoom);
            currentRoom = null;
            $currentRoomDisplay.text("NO ROOMS");
            $messagesDiv.empty();
        }
        if (isMobileView()) {
            showOnlyContact();
        }
        $chatArea.addClass("d-none");
        $chatPlaceholder.removeClass("d-none");
    });
    $sendButton.on("click", function () {
        var message = $messageInput.val();
        if (currentRoom && message) {
            socket.emit("message", { room: currentRoom, message: message });
            $messageInput.val("");
        }
    });
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
    socket.on("previousMessages", function (messages) {
        messages.forEach(function (_a) {
            var username = _a.username, content = _a.content, imageUrl = _a.imageUrl;
            displayMessage(username, content, imageUrl);
        });
    });
    socket.on("message", function (_a) {
        var username = _a.username, message = _a.message, fileUrl = _a.fileUrl;
        displayMessage(username, message, fileUrl);
    });
    var displayMessage = function (username, message, fileUrl) {
        var $messageElement = $("<div>").addClass("message-item d-flex align-items-start mb-2");
        var $messageContent;
        var initials = username.substring(0, 2).toUpperCase();
        var $avatar = $("<div>")
            .addClass("avatar rounded-circle text-white text-center me-2 d-flex align-items-center justify-content-center")
            .css({
            width: "32px",
            height: "32px",
            backgroundColor: "#007bff",
            fontSize: "12px",
        })
            .text(initials);
        if (usernameLogged === username) {
            $messageContent = $("<div>")
                .addClass("messages p-2 mb-2 message-logged-user rounded border")
                .append($("<strong>").text(username + ": "))
                .append($("<span>").text(message));
        }
        else {
            $messageContent = $("<div>")
                .addClass("messages p-2 mb-2 message-other-user rounded border")
                .append($("<strong>").text(username + ": "))
                .append($("<span>").text(message));
        }
        if (fileUrl) {
            var isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl);
            if (isImage) {
                var $fileElement = $("<img>")
                    .attr("src", fileUrl)
                    .attr("alt", "Image sent")
                    .addClass("img-thumbnail mt-2");
                $messageContent.append($fileElement);
            }
            else {
                var $fileLink = $("<a>")
                    .attr("href", fileUrl)
                    .attr("target", "_blank")
                    .text("Click here to download the file")
                    .addClass("file-link d-block mt-2 text-primary");
                $messageContent.append($fileLink);
            }
        }
        $messageElement.append($avatar).append($messageContent);
        $messagesDiv.append($messageElement);
        //$messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    };
});
