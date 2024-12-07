$(() => {
  const deleteButton = $(".delete-button");

  deleteButton.on("click", (e) => {
    const target = $(e.currentTarget);
    const postId = target.data("post-id");
    const postData = (url: string, method: string, data: any) => {
      $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
          window.location.reload();
        },
        error: function (xhr, status, error) {
          console.log(
            `Request failed. Status: ${status}, Error: ${error}, Response text: ${xhr.responseText}`
          );
        },
      });
    };
    postData("/post", "DELETE", { postId });
  });
});
