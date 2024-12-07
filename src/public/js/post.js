$(function () {
    var deleteButton = $(".delete-button");
    deleteButton.on("click", function (e) {
        var target = $(e.currentTarget);
        var postId = target.data("post-id");
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
                    console.log("Request failed. Status: ".concat(status, ", Error: ").concat(error, ", Response text: ").concat(xhr.responseText));
                },
            });
        };
        postData("/post", "DELETE", { postId: postId });
    });
});
