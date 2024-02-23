function Student(name, dateOfBirth) {
  this.name = name;
  this.dateOfBirth = dateOfBirth;
  this.id = new Date().toISOString();
}
document.addEventListener("DOMContentLoaded", function () {
  // Place your code here to ensure it runs after the DOM is fully loaded
  document.querySelector("#tbody").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-remove")) {
      const studentId = event.target.getAttribute("data-id");
      const ui = new UI();
      const store = new Store();

      ui.removeStudentFromUI(studentId);
      store.removeStudentFromStore(studentId);

      alert("Xóa sinh viên thành công!");
    }
  });
});
function UI() {}
let studentCount = 0; // Biến đếm số sinh viên
UI.prototype.addStudentToUI = function (student) {
  studentCount++;
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td>${studentCount}</td>
      <td>${student.name}</td>
      <td>${student.dateOfBirth}</td>
      <td>
        <button class="btn btn-danger btn-remove" data-id="${student.id}">xóa</button>
      </td>
    `;
  document.querySelector("#tbody").appendChild(tr);
};

UI.prototype.removeStudentFromUI = function (id) {
  const trToRemove = document.querySelector(`[data-id="${id}"]`).closest("tr");
  trToRemove.remove();
};

function Store() {}

Store.prototype.getStudents = function () {
  return JSON.parse(localStorage.getItem("students")) || [];
};

Store.prototype.addStudentToStore = function (student) {
  const students = this.getStudents();
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
};

Store.prototype.removeStudentFromStore = function (id) {
  let students = this.getStudents();
  students = students.filter((student) => student.id !== id);
  localStorage.setItem("students", JSON.stringify(students));
};

document.querySelector("#studentForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#Name").value;
  const dateOfBirth = document.querySelector("#date").value;

  if (name && dateOfBirth) {
    const student = new Student(name, dateOfBirth);
    const ui = new UI();
    const store = new Store();

    ui.addStudentToUI(student);
    store.addStudentToStore(student);

    // Clear input fields after adding student // xóa biến khi đã add xong
    document.querySelector("#Name").value = "";
    document.querySelector("#date").value = "";

    alert("Thêm sinh viên thành công!");
  } else {
    alert("Vui lòng nhập đầy đủ thông tin sinh viên!");
  }
});

document.querySelector("#tbody").addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-remove")) {
    const studentId = event.target.getAttribute("data-id");
    const ui = new UI();
    const store = new Store();

    ui.removeStudentFromUI(studentId);
    store.removeStudentFromStore(studentId);

    alert("Xóa sinh viên thành công!");
  }
});

// Load students from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const store = new Store();
  const students = store.getStudents();
  const ui = new UI();

  students.forEach((student) => {
    ui.addStudentToUI(student);
  });
});
