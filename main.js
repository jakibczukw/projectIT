function UserTable({ content, form, addBtn, userInfo, localStorageKeyName }) {
    this.initialization = function () {
        this.formOpen();
        this.onSubmit();
        this.loadUser();
    };

    this.formOpen = function () {
        addBtn.addEventListener('click', function () {
            form.elements['id'].value = '';
            form.classList.add('open');
        });
    };

    this.onSubmit = function () {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (form.elements['id'].value) {
                this.editUser({
                    name: form.elements['name'].value,
                    age: form.elements['age'].value,
                    phone: form.elements['phone'].value,
                    id: form.elements['id'].value,
                });
            } else {
                this.addUser({
                    name: form.elements['name'].value,
                    age: form.elements['age'].value,
                    phone: form.elements['phone'].value,
                    id: Math.floor(Math.random() * 100),
                });
            }
            form.reset();
            form.classList.remove('open');
        });
    };

    this.userTemplate = function (user) {
        content.insertAdjacentHTML(
            'beforeend',
            `<tr data-id="${user.id}">
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.phone}</td>
                <td>${user.age}</td>
                    <td>
                        <button type="button" class="btn btn-primary js--view">View</button>
                        <button type="button" class="btn btn-primary js--edit">Edit</button>
                        <button type="button" class="btn btn-primary js--delete">Delete</button>
                    </td>
            </tr>`
        );

        const currentTr = document.querySelector(`[data-id="${user.id}"]`);
        const viewBtn = currentTr.querySelector('.js--view');
        const deleteBtn = currentTr.querySelector('.js--delete');
        const editBtn = currentTr.querySelector('.js--edit');
        viewBtn.addEventListener('click', () => {
            userInfo.innerHTML = JSON.stringify(user, undefined, 2);
        });
        const users =
            JSON.parse(localStorage.getItem(localStorageKeyName)) || [];
        deleteBtn.addEventListener('click', () => {
            const updatedUsers = users.filter((obj) => obj.id !== user.id);
            localStorage.setItem(
                localStorageKeyName,
                JSON.stringify(updatedUsers)
            );
            deleteBtn.closest('tr').remove();
        });
        editBtn.addEventListener('click', () => {
            form.reset();
            form.classList.add('open');
            form.elements['id'].value = user.id;
            form.elements['name'].value = user.name;
            form.elements['phone'].value = user.phone;
            form.elements['age'].value = user.age;
        });
    };

    this.addUser = function (user) {
        this.userTemplate(user);
        const users =
            JSON.parse(localStorage.getItem(localStorageKeyName)) || [];
        users.push(user);
        localStorage.setItem(localStorageKeyName, JSON.stringify(users));
    };

    this.editUser = function (user) {
        const users = JSON.parse(localStorage.getItem(localStorageKeyName));
        const newUsers = users.map((item) => {
            if (+item.id === +user.id) {
                return user;
            } else {
                return item;
            }
        });
        content.innerHTML = '';
        newUsers.forEach((user) => this.userTemplate(user));
        localStorage.setItem(localStorageKeyName, JSON.stringify(newUsers));
    };

    this.loadUser = function () {
        const users = JSON.parse(localStorage.getItem(localStorageKeyName));
        if (users) {
            users.forEach((user) => this.userTemplate(user));
        }
    };
}

const userDate = new UserTable({
    localStorageKeyName: 'users',
    content: document.querySelector('.js--content'),
    form: document.querySelector('.js--form'),
    addBtn: document.querySelector('.js--add'),
    userInfo: document.querySelector('.js--user'),
});

document.addEventListener('DOMContentLoaded', function () {
    userDate.initialization();
});
