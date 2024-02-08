const express = require("express")
const router =  express.Router()

const { auth } = require("../middlewares/auth")

const { 

    updateProfile ,
    deleteAccount,
    getAllUserDetails,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
router.post("/updateProfile", auth, updateProfile)
router.delete("/deleteAccount", auth, deleteAccount)
router.get("/getAlluserDetails", auth, getAllUserDetails)

//// Get Enrolled Courses
///updateDisplayPicture
module.exports = router