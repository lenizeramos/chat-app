"use strict";
$(() => {
    $("#sign-up-btn").on("click", () => {
        var _a;
        $(".container-auth").addClass("sign-up-mode");
        $(".sign-in-form .alert").remove();
        $(".sign-up-form .alert").remove();
        (_a = $(".sign-in-form").get(0)) === null || _a === void 0 ? void 0 : _a.reset();
    });
    $("#sign-in-btn").on("click", () => {
        var _a;
        $(".container-auth").removeClass("sign-up-mode");
        $(".sign-in-form .alert").remove();
        $(".sign-up-form .alert").remove();
        (_a = $(".sign-up-form").get(0)) === null || _a === void 0 ? void 0 : _a.reset();
    });
    $(".sign-in-form").on("submit", function (e) {
        e.preventDefault();
        const postData = (url, method, data) => {
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
                    }
                    else {
                        window.location.href = "/";
                    }
                },
                error: () => {
                    $(".sign-in-form .alert").remove();
                    $(".sign-in-form").prepend(`
              <div class="alert alert-danger" role="alert">Unexpected error</div>
            `);
                }
            });
        };
        postData("/auth/login", "POST", $(this).serialize());
    });
    $(".sign-up-form").on("submit", function (e) {
        e.preventDefault();
        const postData = (url, method, data) => {
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
                    }
                    else {
                        window.location.href = "/";
                    }
                },
                error: () => {
                    $(".sign-up-form .alert").remove();
                    $(".sign-up-form").prepend(`
              <div class="alert alert-danger" role="alert">Unexpected error</div>
            `);
                }
            });
        };
        postData("/auth/register", "POST", $(this).serialize());
    });
});
