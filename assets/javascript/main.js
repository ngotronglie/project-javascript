// Định nghĩa class Student
function Student(name, dateOfBirth) {
  this.name = name;
  this.dateOfBirth = dateOfBirth;
  this.id = new Date().toISOString();
}

// Sự kiện DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Lắng nghe sự kiện click trên tbody để xóa sinh viên
  document.querySelector("#tbody").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-remove")) {
      const studentId = event.target.getAttribute("data-id");
      const ui = new UI();
      const store = new Store();

      ui.removeStudentFromUI(studentId);
      store.removeStudentFromStore(studentId);

      // Hiển thị Bootstrap alert và tự động biến mất sau 2 giây
      ui.showNotification("Xóa sinh viên thành công!", "success");
    }
  });
});

// Class UI
function UI() {}
let count = 0;
// Phương thức thêm sinh viên vào giao diện người dùng
UI.prototype.addStudentToUI = function (student) {
  const tr = document.createElement("tr");
  count++;
  tr.innerHTML = `
      <td>${count}</td>
      <td>${student.name}</td>
      <td>${student.dateOfBirth}</td>
      <td>
        <button class="btn btn-danger btn-remove" data-id="${student.id}">Xóa</button>
      </td>
    `;
  document.querySelector("#tbody").appendChild(tr);
};

// Phương thức hiển thị Bootstrap alert và tự động biến mất
UI.prototype.showNotification = function (message, type) {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} fade show`;
  notification.textContent = message;
  document.getElementById("notification").appendChild(notification);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 1000);
  }, 2000);
};

// Phương thức xóa sinh viên khỏi giao diện người dùng
UI.prototype.removeStudentFromUI = function (id) {
  const trToRemove = document.querySelector(`[data-id="${id}"]`).closest("tr");
  trToRemove.remove();
};

// Class Store
function Store() {}

// Phương thức lấy danh sách sinh viên từ Local Storage
Store.prototype.getStudents = function () {
  return JSON.parse(localStorage.getItem("students")) || [];
};

// Phương thức thêm sinh viên vào Local Storage
Store.prototype.addStudentToStore = function (student) {
  const students = this.getStudents();
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
};

// Phương thức xóa sinh viên khỏi Local Storage
Store.prototype.removeStudentFromStore = function (id) {
  let students = this.getStudents();
  students = students.filter((student) => student.id !== id);
  localStorage.setItem("students", JSON.stringify(students));
};

// Sự kiện submit form thêm sinh viên
document.querySelector("#studentForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#Name").value.trim();
  const dateOfBirth = document.querySelector("#date").value;

  // Validate dữ liệu trước khi thêm sinh viên
  if (!name || !dateOfBirth) {
    // Hiển thị Bootstrap alert với thông báo lỗi
    const ui = new UI();
    ui.showNotification("Vui lòng nhập đầy đủ thông tin sinh viên!", "danger");
    return;
  }

  // Thêm sinh viên vào giao diện người dùng và Local Storage
  const student = new Student(name, dateOfBirth);
  const ui = new UI();
  const store = new Store();

  ui.addStudentToUI(student);
  store.addStudentToStore(student);

  // Xóa dữ liệu đã nhập sau khi thêm sinh viên thành công
  document.querySelector("#Name").value = "";
  document.querySelector("#date").value = "";

  // Hiển thị Bootstrap alert với thông báo thành công
  ui.showNotification(
    `Thêm sinh viên '${name}' có ngày sinh '${dateOfBirth}' thành công!`,
    "success"
  );
});

// Load danh sách sinh viên từ Local Storage khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  const store = new Store();
  const students = store.getStudents();
  const ui = new UI();

  students.forEach((student) => {
    ui.addStudentToUI(student);
  });
});
