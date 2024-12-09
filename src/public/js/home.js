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
                    console.log(fileUrl, "FRONTEND fileURL");
                    console.log(currentRoom, "FRONTEND currentRoom");
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
            /* let $messageElement;
            if (usernameLogged === username) {
              $messageElement = $("<div>")
                .addClass("messages p-2 mb-2 message-logged-user rounded border")
                .text(`${username}: ${content}`);
            } else {
              $messageElement = $("<div>")
                .addClass("messages p-2 mb-2 message-other-user rounded border")
                .text(`${username}: ${content}`);
            }
    
            $messagesDiv.append($messageElement); */
        });
    });
    socket.on("message", function (_a) {
        var username = _a.username, message = _a.message, fileUrl = _a.fileUrl;
        displayMessage(username, message, fileUrl);
        /* let $messageElement;
        if (usernameLogged === username) {
          $messageElement = $("<div>")
            .addClass("messages p-2 mb-2 message-logged-user rounded border")
            .text(`${username}: ${message}`);
        } else {
          $messageElement = $("<div>")
            .addClass("messages p-2 mb-2 message-other-user rounded border")
            .text(`${username}: ${message}`);
        }
        $messagesDiv.append($messageElement); */
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
        $messagesDiv.append($messageElement);
        //$messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    };
});
