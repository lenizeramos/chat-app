$(() => {
    $("#sign-up-btn").on("click", () => {
      $(".container-auth").addClass("sign-up-mode");
      $(".sign-in-form .alert").remove();
      $(".sign-up-form .alert").remove();
      ($(".sign-in-form").get(0) as HTMLFormElement)?.reset();
    });
  
    $("#sign-in-btn").on("click", () => {
      $(".container-auth").removeClass("sign-up-mode");
      $(".sign-in-form .alert").remove();
      $(".sign-up-form .alert").remove();
      ($(".sign-up-form").get(0) as HTMLFormElement)?.reset();
    });
  
    $(".sign-in-form").on("submit", function (e) {
      e.preventDefault();
  
      const postData = (url: string, method: string, data: any) => {
        $.ajax({
          url: url,
          method: method,
          data: data,
          success: (response) => {
            if (response.error) {
              $(".sign-in-form .alert").remove();
              $(".sign-in-form").prepend(`
                <div class="alert alert-danger" role="alert">${response.error}</div>
              `);
            } else {
              window.location.href = "/";
            }
          },
          error: (xhr, status, error) => {
            $(".sign-in-form .alert").remove();
            $(".sign-in-form").prepend(`
              <div class="alert alert-danger" role="alert">${xhr.responseJSON?.error || "Unexpected error occurred"}</div>
            `);
          }
        });
      };
  
      postData("/auth/login", "POST", $(this).serialize());
    });
  
    $(".sign-up-form").on("submit", function (e) {
      e.preventDefault();
  
      const postData = (url: string, method: string, data: any) => {
        $.ajax({
          url: url,
          method: method,
          data: data,
          success: (response) => {
            if (response.error) {
              $(".sign-up-form .alert").remove();
              $(".sign-up-form").prepend(`
                <div class="alert alert-danger" role="alert">${response.error}</div>
              `);
            } else {
              window.location.href = "/";
            }
          },
          error: (xhr, status, error) => {
            $(".sign-up-form .alert").remove();
            $(".sign-up-form").prepend(`
              <div class="alert alert-danger" role="alert">${xhr.responseJSON?.error || "Unexpected error occurred"}</div>
            `);
          }
        });
      };
  
      postData("/auth/register", "POST", $(this).serialize());
    });
  });