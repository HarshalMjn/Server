//Import the reuired modules
const express = require("express")
const router = express.Router()

//import the controllers

//course Controllers Import 
const {
    createCourse,
    showAllCourses,
    getAllCoursesDetalis,
} = require("../controllers/Course")

// Categories Controllers Import 
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category")

//Secton Controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section")

// Sub-Section Controllers Import
const {
    createSubsection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection")

//Rating Controlles Import
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin} = require("../middlewares/auth")

// ********************************************************************************************************
//                                             Course routes
// ********************************************************************************************************

//course can only be created by Instructors
router.post("/crearteCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection",auth, isInstructor, createSection)
//Update a Section
router.post("/updateSection", auth, isInstructor,updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection",auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("addSubSection", auth, isInstructor, createSubsection)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getAllCoursesDetalis)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
//Category can only be create by Admin
//Do:  put IsAdmin Middleare here
router.post("/createCategory",auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating",getAverageRating)
router.get("getReviews", getAllRating)

module.exports = router