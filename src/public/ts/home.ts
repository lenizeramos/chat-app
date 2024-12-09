/// <reference types="jquery" />

declare const io: any;
declare const usernameLogged: string;

interface User {
    id: number;
    username: string;
    avatar?: string;
}

interface Message {
    username: string;
    content: string;
}

$(() => {
    const postData = (url: string, method: string, data?: any): void => {
        $.ajax({
            url: url,
            method: method,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                window.location.reload();
            },
            error: function (xhr: any, status: string, error: string) {
                console.log("Error: ", status, error, xhr.responseText);
            },
        });
    };

    // Search functionality
    const $searchInput: JQuery = $("#searchUserInput");
    const $searchResults: JQuery = $("#searchResults");
    let searchTimeout: NodeJS.Timeout;
    let selectedUserId: number | null = null;

    $searchInput.on("input", function(this: HTMLInputElement) {
        clearTimeout(searchTimeout);
        selectedUserId = null; // Clear selected user when input changes
        const searchTerm: string = $(this).val()?.toString().trim() || "";

        if (searchTerm === "") {
            $searchResults.addClass("d-none").empty();
            return;
        }

        searchTimeout = setTimeout(function() {
            $.get("/search-users?search=" + encodeURIComponent(searchTerm))
                .done(function(users: User[]) {
                    if (users.length === 0) {
                        $searchResults.addClass("d-none").empty();
                        return;
                    }

                    const resultsHtml = users.map(function(user) {
                        const initials = user.username.substring(0, 2).toUpperCase();
                        const avatarHtml = user.avatar 
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
                .fail(function(error: any) {
                    console.error("Search failed:", error);
                });
        }, 300);
    });

    // Handle search result selection
    $(document).on("click", ".search-result", function(this: HTMLElement) {
        const userId = $(this).data("user-id");
        const username = $(this).data("username");
        selectedUserId = userId;
        $searchInput.val(username);
        $searchResults.addClass("d-none");
        postData("/chat/direct", "POST", { id: userId });
    });

    // Handle search form submission
    $("#searchForm").on("submit", function(e: JQuery.TriggeredEvent) {
        e.preventDefault();
        if (selectedUserId) {
            postData("/chat/direct", "POST", { id: selectedUserId });
        }
        // If no user is selected, do nothing
    });

    // Hide search results when clicking outside
    $(document).on("click", function(e: JQuery.TriggeredEvent) {
        if (!$(e.target).closest(".search-container").length) {
            $searchResults.addClass("d-none");
        }
    });

    const socket = io({ query: { username: usernameLogged } });
    let currentRoom: string | null = null;
    const $messageInput: JQuery<HTMLInputElement> = $(".messageInput");
    const $sendButton: JQuery = $(".sendButton");
    const $messagesDiv: JQuery = $(".messages");
    const $joinRoomButton: JQuery = $(".joinRoomButton");
    const $leaveRoomButton: JQuery = $(".leaveRoomButton");
    const $currentRoomDisplay: JQuery = $(".currentRoom");

    $joinRoomButton.on("click", (e: JQuery.TriggeredEvent) => {
        const target = $(e.currentTarget);
        const room = target.data("chat-id");
        const chatName = target.data("chat-name");
        console.log(room);
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
            socket.emit("message", { room: currentRoom, message: message });
            $messageInput.val("");
        }
    });

    socket.on("previousMessages", function (messages: Message[]) {
        messages.forEach(function ({ username, content }) {
            const initials = username.substring(0, 2).toUpperCase();
            const $messageElement = $("<div>").addClass("message-item d-flex align-items-start mb-2");
            
            const $avatar = $("<div>")
                .addClass("avatar rounded-circle text-white text-center me-2 d-flex align-items-center justify-content-center")
                .css({
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#007bff",
                    fontSize: "12px"
                })
                .text(initials);

            const $messageContent = $("<div>")
                .addClass("message-content")
                .append($("<strong>").text(username + ": "))
                .append($("<span>").text(content));

            $messageElement.append($avatar).append($messageContent);
            $messagesDiv.append($messageElement);
        });
        
        // Scroll to bottom after adding messages
        $messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    });

    socket.on("message", function ({ id, message }: { id: string; message: string }) {
        const initials = id.substring(0, 2).toUpperCase();
        const $messageElement = $("<div>").addClass("message-item d-flex align-items-start mb-2");
        
        const $avatar = $("<div>")
            .addClass("avatar rounded-circle text-white text-center me-2 d-flex align-items-center justify-content-center")
            .css({
                width: "32px",
                height: "32px",
                backgroundColor: "#007bff",
                fontSize: "12px"
            })
            .text(initials);

        const $messageContent = $("<div>")
            .addClass("message-content")
            .append($("<strong>").text(id + ": "))
            .append($("<span>").text(message));

        $messageElement.append($avatar).append($messageContent);
        $messagesDiv.append($messageElement);
        
        // Scroll to bottom after adding new message
        $messagesDiv.scrollTop($messagesDiv[0].scrollHeight);
    });
});
