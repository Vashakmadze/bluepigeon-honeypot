export const getUsers = async () => {
    return fetch("http://localhost:8080/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(result => {
        return result.json();
    })
}

export const deleteUser = async (email) => {
    const body = JSON.stringify({
        email,
    });

    return fetch("http://localhost:8080/delete", {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json"
        },
    }).then(result => {
        return result.json();
    })
}

export const disableUser = async (email) => {
    const body = JSON.stringify({
        email,
    });

    return fetch("http://localhost:8080/disable", {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json"
        },
    }).then(result => {
        return result.json();
    })
}

export const enableUser = async (email) => {
    const body = JSON.stringify({
        email,
    });

    return fetch("http://localhost:8080/enable", {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json"
        },
    }).then(result => {
        return result.json();
    })
}


