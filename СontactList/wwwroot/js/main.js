
function GetContacts() {
    const response = await fetch("/api/contacts", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const contacts = await response.json();
        let rows = document.querySelector("tbody");
        contacts.forEach(contact => {
            rows.append(row(contact));
        });
    }
}

function GetContact(id) {
    const response = await fetch("/api/contacts/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const contact = await response.json();
        const form = document.forms["contactForm"];
        form.elements["id"].value = contact.id;
        form.elements["surname"].value = contact.surname;
        form.elements["name"].value = contact.name;
        form.elements["mail"].value = contact.mail;
        form.elements["phone"].value = contact.phone;
    }
}

function CreateContact(userSurname, userName, userMail, userPhone) {

    const response = await fetch("api/contacts", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            surname: userSurname,
            name: userName,
            mail: userMail,
            phone: userPhone
        })
    });
    if (response.ok === true) {
        const contact = await response.json();
        reset();
        document.querySelector("tbody").append(row(contact));
    }
}

function EditContact(userId, userSurname, userName, userMail, userPhone) {
    const response = await fetch("api/contacts", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: parseInt(userId, 10),
            surname: userSurname,
            name: userName,
            mail: userMail,
            phone: userPhone
        })
    });
    if (response.ok === true) {
        const contact = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + contact.id + "']").replaceWith(row(contact));
    }
}

function DeleteContact(id) {
    const response = await fetch("/api/contacts/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const contact = await response.json();
        document.querySelector("tr[data-rowid='" + contact.id + "']").remove();
    }
}


function reset() {
    const form = document.forms["contactForm"];
    form.reset();
    form.elements["id"].value = 0;
}

function row(contact) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", contact.id);

    const idTd = document.createElement("td");
    idTd.append(contact.id);
    tr.append(idTd);

    const surnameTd = document.createElement("td");
    surnameTd.append(contact.surname);
    tr.append(surnameTd);

    const nameTd = document.createElement("td");
    nameTd.append(contact.name);
    tr.append(nameTd);

    const mailTd = document.createElement("td");
    mailTd.append(contact.mail);
    tr.append(mailTd);

    const phoneTd = document.createElement("td");
    phoneTd.append(contact.phone);
    tr.append(phoneTd);

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", contact.id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Изменить");
    editLink.addEventListener("click", e => {

        e.preventDefault();
        GetContact(contact.id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", contact.id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Удалить");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        DeleteContact(contact.id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

document.getElementById("reset").click(function (e) {

    e.preventDefault();
    reset();
})


document.forms["contactForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["contactForm"];
    const id = form.elements["id"].value;
    const surname = form.elements["surname"].value;
    const name = form.elements["name"].value;
    const mail = form.elements["mail"].value;
    const phone = form.elements["phone"].value;
    if (id == 0)
        CreateContact(surname, name, mail, phone);
    else
        EditContact(id, surname, name, mail, phone);
});


GetContacts();

