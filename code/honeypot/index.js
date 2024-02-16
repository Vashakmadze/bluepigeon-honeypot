const init = () => {
    document.querySelectorAll(".add").forEach(function (button) {
        button.addEventListener("click", function () {
            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;

            const data = {
                name: name,
                email: email,
            };

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "insert_data.php", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText);
                    if (window.confirm('Refresh the page to see the update or click ok!')) {
                        location.reload();
                    }
                }
            };

            xhr.send(JSON.stringify(data));
        });
    });

    document.querySelectorAll(".enable")?.forEach(function (button) {
        button.addEventListener("click", () => {
            const id = button.value;
            const status = button.id;

            const data = {
                id: id,
                status: status == 1 ? 0 : 1,
            };

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "status_user.php", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (window.confirm('Refresh the page to see the update or click ok!')) {
                        location.reload();
                    }
                }
            };

            xhr.send(JSON.stringify(data));
        });
    });

    document.querySelectorAll(".delete")?.forEach(function (button) {
        button.addEventListener("click", () => {
            const id = button.value;

            const data = {
                id: id,
            };

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "delete_user.php", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (window.confirm('Refresh the page to see the update or click ok!')) {
                        location.reload();
                    }
                }
            };

            xhr.send(JSON.stringify(data));
        });
    });
}

document.addEventListener("DOMContentLoaded", init);
