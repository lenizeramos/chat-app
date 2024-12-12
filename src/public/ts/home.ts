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

  // Group creation functionality
  const selectedUsers: User[] = [];
  const $searchGroupUsers = $("#searchGroupUsers");
  const $usersDropdown = $("#usersDropdown");
  const $selectedUsersAvatars = $("#selectedUsersAvatars");
  const $createGroupForm = $("#createGroupForm");
  const $cancelGroupButton = $("#cancelGroupButton");

  function updateSelectedUsersDisplay() {
    $selectedUsersAvatars.empty();
    selectedUsers.forEach(user => {
      const initials = user.username.trim().substring(0, 2).toUpperCase();
      console.log(initials, );
      console.log("/" + user.username + "/");
      
      const avatarHtml = user.avatar
        ? `<img src="${user.avatar}" class="avatar-img" alt="${user.username}'s avatar">`
        : `<div class="avatar-initials">${initials}</div>`;

      const $userAvatar = $(`
        <div class="selected-user-avatar">
          <div class="avatar rounded-circle">
            ${avatarHtml}
          </div>
          <div class="remove-user" data-user-id="${user.id}">×</div>
        </div>
      `);

      $selectedUsersAvatars.append($userAvatar);
    });
  }

  function loadAllUsers() {
    $.get("/chat/users")
      .done((users: User[]) => {
        $usersDropdown.empty();
        users.forEach(user => {
          if (user.username !== usernameLogged) {
            const initials = user.username.trim().substring(0, 2).toUpperCase();
            const avatarHtml = user.avatar
              ? `<img src="${user.avatar}" class="avatar-img" alt="${user.username}'s avatar">`
              : `<div class="avatar-initials">${initials}</div>`;

            const isSelected = selectedUsers.some(u => u.id === user.id);
            const $userItem = $(`
              <div class="user-item ${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
                <div class="avatar rounded-circle user-avatar">
                  ${avatarHtml}
                </div>
                <div class="user-info">
                  ${user.username}
                </div>
              </div>
            `);
            $usersDropdown.append($userItem);
          }
        });
      })
      .fail(error => {
        console.error("Failed to load users:", error);
      });
  }

  // Load users when clicking on search input
  $searchGroupUsers.on("focus", function() {
    loadAllUsers();
  });

  $searchGroupUsers.on("input", function(this: HTMLInputElement) {
    const searchTerm = $(this).val()?.toString().toLowerCase() || "";
    $(".user-item").each(function() {
      const username = $(this).find(".user-info").text().toLowerCase();
      $(this).toggle(username.includes(searchTerm));
    });
  });

  $(document).on("click", ".user-item", function() {
    const userId = $(this).data("user-id");
    const username = $(this).find(".user-info").text();
    const avatar = $(this).find(".avatar-img").attr("src");

    const userIndex = selectedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      selectedUsers.push({ id: userId, username, avatar });
      $(this).addClass("selected");
    } else {
      selectedUsers.splice(userIndex, 1);
      $(this).removeClass("selected");
    }

    updateSelectedUsersDisplay();
  });

  $(document).on("click", ".remove-user", function(e) {
    e.stopPropagation();
    const userId = $(this).data("user-id");
    const userIndex = selectedUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      selectedUsers.splice(userIndex, 1);
      $(`.user-item[data-user-id="${userId}"]`).removeClass("selected");
      updateSelectedUsersDisplay();
    }
  });

  $createGroupForm.on("submit", function(e: JQuery.TriggeredEvent) {
    e.preventDefault();
    const groupName = $("#groupName").val()?.toString().trim();
    
    if (!groupName) {
      alert("Please enter a group name");
      return;
    }

    if (selectedUsers.length === 0) {
      alert("Please select at least one user for the group");
      return;
    }

    const groupData = {
      name: groupName,
      users: selectedUsers.map(u => u.id)
    };

    postData("/chat/group", "POST", groupData);
  });

  $cancelGroupButton.on("click", () => {
    if (isMobileView()) {
      showOnlyContact();
    }
    selectedUsers.length = 0;
    $createGroupForm.addClass("d-none");
    $chatPlaceholder.removeClass("d-none");
    $("#groupName").val("");
    $searchGroupUsers.val("");
    updateSelectedUsersDisplay();
  });

  // Search functionality
  const $searchInput: JQuery = $("#searchUserInput");
  const $searchResults: JQuery = $("#searchResults");
  let searchTimeout: NodeJS.Timeout;
  let selectedUserId: number | null = null;

  $searchInput.on("input", function (this: HTMLInputElement) {
    clearTimeout(searchTimeout);
    selectedUserId = null; // Clear selected user when input changes
    const searchTerm: string = $(this).val()?.toString().trim() || "";

    if (searchTerm === "") {
      $searchResults.addClass("d-none").empty();
      return;
    }

    searchTimeout = setTimeout(function () {
      $.get("/search-users?search=" + encodeURIComponent(searchTerm))
        .done(function (users: User[]) {
          if (users.length === 0) {
            $searchResults.addClass("d-none").empty();
            return;
          }

          const resultsHtml = users
            .map(function (user) {
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
            })
            .join("");

          $searchResults.html(resultsHtml).removeClass("d-none");
        })
        .fail(function (error: any) {
          console.error("Search failed:", error);
        });
    }, 300);
  });

  // Handle search result selection
  $(document).on("click", ".search-result", function (this: HTMLElement) {
    const userId = $(this).data("user-id");
    const username = $(this).data("username");
    selectedUserId = userId;
    $searchInput.val(username);
    $searchResults.addClass("d-none");
    postData("/chat/direct", "POST", { id: userId });
  });

  // Handle search form submission
  $("#searchForm").on("submit", function (e: JQuery.TriggeredEvent) {
    e.preventDefault();
    if (selectedUserId) {
      postData("/chat/direct", "POST", { id: selectedUserId });
    }
    // If no user is selected, do nothing
  });

  // Hide search results when clicking outside
  $(document).on("click", function (e: JQuery.TriggeredEvent) {
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
  const $chatArea: JQuery = $(".chat-area");
  const $chatPlaceholder: JQuery = $(".chat-placeholder");
  const $createGroupButton: JQuery = $("#createGroupButton");
  const $contact: JQuery = $("#contact");
  const $chatRoom: JQuery = $("#chatRoom");

  const isMobileView = () => ($(window).width() || 0) <= 768;
  const showOnlyContact = () => {
    $chatRoom.addClass("d-none");
    $contact.removeClass("d-none");
  };
  const showOnlyChatRoom = () => {
    $chatRoom.removeClass("d-none");
    $contact.addClass("d-none");
  };
  const showContactAndChatRoom = () => {
    $chatRoom.removeClass("d-none");
    $contact.removeClass("d-none");
  };

  if (isMobileView()) {
    showOnlyContact();
  }

  $(window).on("resize", () => {
    if (isMobileView()) {
      showOnlyContact();
    } else {
      showContactAndChatRoom();
    }
  });

  $createGroupButton.on("click", () => {
    if (isMobileView()) {
      showOnlyChatRoom();
    }

    $createGroupForm.removeClass("d-none");
    $chatPlaceholder.addClass("d-none");
    $chatArea.addClass("d-none");
    loadAllUsers(); // Load users when opening the form
  });

  $joinRoomButton.on("click", (e: JQuery.TriggeredEvent) => {
    const target = $(e.currentTarget);
    const room = target.data("chat-id");
    const chatName = target.data("chat-name");

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

  $leaveRoomButton.on("click", () => {
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

  $sendButton.on("click", () => {
    const message = $messageInput.val() as string;
    if (currentRoom && message) {
      socket.emit("message", { room: currentRoom, message: message });
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
      messages.forEach(function ({ username, content, imageUrl }) {
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
    const $messageElement = $("<div>").addClass(
      "message-item d-flex align-items-start mb-2"
    );
    let $messageContent;
    const initials = username.substring(0, 2).toUpperCase();

    const $avatar = $("<div>")
      .addClass(
        "avatar rounded-circle text-white text-center me-2 d-flex align-items-center justify-content-center"
      )
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
    } else {
      $messageContent = $("<div>")
        .addClass("messages p-2 mb-2 message-other-user rounded border")
        .append($("<strong>").text(username + ": "))
        .append($("<span>").text(message));
    }

    if (fileUrl) {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl);

      if (isImage) {
        const $fileElement = $("<img>")
          .attr("src", fileUrl)
          .attr("alt", "Image sent")
          .addClass("img-thumbnail mt-2");
        $messageContent.append($fileElement);
      } else {
        const $fileLink = $("<a>")
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
