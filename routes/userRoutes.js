
const express = require("express");
const {
  getAllUsers,
  registerController,loginController, forgotPasswordController, resetPasswordController,
  verifyEmailController
} = require("../controllers/userController");

const { requireSignIn, isAdmin } = require("../middlewares/auth");

//routes object
const router = express.Router();

//GET ALL USERS || GET
router.get("/admin/all-users", getAllUsers);
//CREATE USER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);
router.get('/verify-email', verifyEmailController);

module.exports = router;
