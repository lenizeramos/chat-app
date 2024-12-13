$(function () {
    $("#sign-up-btn").on("click", function () {
        var _a;
        $(".container-auth").addClass("sign-up-mode");
        $(".sign-in-form .alert").remove();
        $(".sign-up-form .alert").remove();
        (_a = $(".sign-in-form").get(0)) === null || _a === void 0 ? void 0 : _a.reset();
    });
    $("#sign-in-btn").on("click", function () {
        var _a;
        $(".container-auth").removeClass("sign-up-mode");
        $(".sign-in-form .alert").remove();
        $(".sign-up-form .alert").remove();
        (_a = $(".sign-up-form").get(0)) === null || _a === void 0 ? void 0 : _a.reset();
    });
    $(".sign-in-form").on("submit", function (e) {
        e.preventDefault();
        var postData = function (url, method, data) {
            $.ajax({
                url: url,
                method: method,
                data: data,
                success: function (response) {
                    if (response.error) {
                        $(".sign-in-form .alert").remove();
                        $(".sign-in-form").prepend("\n                <div class=\"alert alert-danger\" role=\"alert\">".concat(response.error, "</div>\n              "));
                    }
                    else {
                        window.location.href = "/";
                    }
                },
                error: function (xhr, status, error) {
                    var _a;
                    $(".sign-in-form .alert").remove();
                    $(".sign-in-form").prepend("\n              <div class=\"alert alert-danger\" role=\"alert\">".concat(((_a = xhr.responseJSON) === null || _a === void 0 ? void 0 : _a.error) || "Unexpected error occurred", "</div>\n            "));
                }
            });
        };
        postData("/auth/login", "POST", $(this).serialize());
    });
    $(".sign-up-form").on("submit", function (e) {
        e.preventDefault();
        var postData = function (url, method, data) {
            $.ajax({
                url: url,
                method: method,
                data: data,
                success: function (response) {
                    if (response.error) {
                        $(".sign-up-form .alert").remove();
                        $(".sign-up-form").prepend("\n                <div class=\"alert alert-danger\" role=\"alert\">".concat(response.error, "</div>\n              "));
                    }
                    else {
                        window.location.href = "/";
                    }
                },
                error: function (xhr, status, error) {
                    var _a;
                    $(".sign-up-form .alert").remove();
                    $(".sign-up-form").prepend("\n              <div class=\"alert alert-danger\" role=\"alert\">".concat(((_a = xhr.responseJSON) === null || _a === void 0 ? void 0 : _a.error) || "Unexpected error occurred", "</div>\n            "));
                }
            });
        };
        postData("/auth/register", "POST", $(this).serialize());
    });
});
