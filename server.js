
const express = require("express");

const app = express();

app.use(express.json());

// Store students in an array
let students = [];

let nextId = 1;

// 1. POST - Add a new student
app.post("/api/students", (req, res) => {

    const { name, course, age } = req.body;

    // Check missing data
    if (!name || !course || age === undefined || age === null || age === "") {
        return res.status(400).json({
            message: "Please enter all details"
        });
    }

    // Check duplicate name
    const exists = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Student name already exists"
        });
    }

    // Create student
    const student = {
        id: nextId++,
        name: name.trim(),
        course: course,
        age: Number(age)
    };

    students.push(student);

    res.status(201).json({
        message: "Student added successfully",
        student: student
    });
});


// 2. GET - Show all students
app.get("/api/students", (req, res) => {

    const course = req.query.course;

    // Filter students by course
    if (course) {
        const result = students.filter(
            s => s.course.toLowerCase() === course.toLowerCase()
        );

        return res.status(200).json(result);
    }

    res.status(200).json(students);
});


// 3. GET - Show student by ID
app.get("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});


// 4. PUT - Update student
app.put("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, course, age } = req.body;

    if (!name || !course || age === undefined || age === null || age === "") {
        return res.status(400).json({
            message: "Please enter all details"
        });
    }

    const exists = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
        && s.id !== id
    );

    if (exists) {
        return res.status(409).json({
            message: "Student name already exists"
        });
    }

    student.name = name.trim();
    student.course = course;
    student.age = Number(age);

    res.status(200).json({
        message: "Student updated successfully",
        student: student
    });
});


// 5. DELETE - Delete student
app.delete("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});


// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
