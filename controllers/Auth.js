const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator =  require("otp-generator");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

// Send OTP For Email Verification
//1)bad approch
// exports.sendotp = async (req, res) => {


//     try{
//      //fetch email from request body
//      const {email} = req.body;
 
//      //check if the user already exit
//      const checkUserPresent = await User.findOne({email});
 
//      //if user user already exit, then return a response
//      if(checkUserPresent) {
//          return res.status(401).json({
//              success:false,
//              message:"user already registered",
 
//          })
//      }
     
//      //genereate otp
//      //line 28 to 48 code bad pratice
//      var otp = otpGenerator.generate(6, {
//          upperCaseAlphabets:false,
//          lowerCaseAlphabets:false,
//          specialChars:false,
//      });
//      console.log("OTP generated", otp);
 
//      //checkunique otp or not
//      const result = await OTP.findOne({otp: otp});
//      console.log("Result is Generate OTP Func");
//      console.log("OTP", otp);
//      console.log("Result",result);
//     //result is exit means OTP is already exit then create new otp using while
//     //jabtk otp  match hoty to prynt
//      while(result) {
//          otp = otpGenerator(6, {
//              upperCaseAlphabets:false,
//              lowerCaseAlphabets:false,
//              specialChars:false,
//          });
//          //check entry in db (loop) so its bad pratice (unqiue otp  -->end loop)
//          result = await OTP.findOne({otp: otp});
//      }
 
//       //unquie otp so create entry for otp in db
 
//      //payload for entry in db 
//       const otpPayload = {email, otp};
 
//       //create an entry for  OTP
//       const otpBody = await OTP.create(otpPayload);
//       console.log(otpBody);
 
//       //return response
//       res.stauts(200).json({
//          success:true,
//          message:"OTP Sent Successfully",
//         otp,
//       })
 
//   }  catch(error) {
//      console.log();
//      return res.status(500).json({
//          success:false,
//          message:error.message,
//      })
 
//     }
    
 
//  }

//----- New approch for sendotp
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

// Signup Controller for Registering USers
exports.singup =  async (req, res) => {

    try{

        //data fetch from requst body 

      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body
    
    //validate data
     if( 
        !firstName || 
        !lastName || 
        !email || 
        !password || 
        !confirmPassword ||
        !otp
        ) {
         return res.status(403).json({
             success:false,
              message:"All fields are required",
          })
      }

     //2 password match (confirm and pass)
     if(password !== confirmPassword) {
       return res.status(400).json({
          success:false,
          message:"Password and confrimPassword value does not match, please try again"
       })
     }



     //check user already exits or not
     const existingUser = await User.findOne({email});
     if(existingUser) {
        return res.status(400).json({
          success:false,
          message:"User is already registered",
        })
     }
  
    //find most recent OTP for the user
    // const recentOtp = await OTP.find({email}).sort({createAt:-1}).limit(1);
    // console.log(recentOtp);

    // //validate OTP
    // if(recentOtp.length == 0) {
    //   //OTP not found
    //   return res.status(400).json({
    //       success:false,
    //       message:"OTP not Found",
    //   })
    // } else if(otp !== recentOtp.otp) {
    //   //invalid OTP
    //   return res.status(400).json({
    //       success:false,
    //       message:"Invalid OTP",
    //   })
    // }
    // Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}


    //Hash Password
    const hashedPasswod = await bcrypt.hash(password, 10);
   
  //create profile  in DB
   const ProfileDetails = await Profile.create({
      gender:null,
      dataOfBirth: null,
      about:null,
      contactNumber:null,
   })

  //entrey create in DB
   const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password:hashedPasswod,
      accountType,
      additionalDetails:ProfileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      
   })


   //return res
   return res.status(200).json({
    success:true,
    message:"User is registered Successfully",
    user,
   })


    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"user cannot be registered. Please try agian",
        })

    }

      
}

//Login
exports.login = async (req,res) => {
    
    try{
        //get data from req. body
        const {email,password} = req.body;
        //validation data
        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:"All fields are required. please try agian",
            });
        }
        //user check exits or not
       const user = await User.findOne({email}).populate("additionalDetails");
       if(!user) {
        return res.status(401).json({
            success:false,
            message:"User is not registrered, please signup first",
        });
       }

        //generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password= undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }
        else {
            return res.status(401).json({
                uccess:false,
                message:"Password is incorrect",
            })
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });

    }
   
};


// Controller for Changing Password
exports.changePassword = async (req, res) => {

    try{

    //get data from req body   //get oldPassword, newPassword, confrimNewPassword
     const { email,oldPassword,newPassword, confrimPassword}  = req.body;
     //validation

     if(!email || !oldPassword || !newPassword || !confrimPassword){
        return res.status(401).json({
            success:false,
            message:"All fields are required. please try agian",
        })
     } 
     //Retrive user from the database
     const user = await User.findOne({email});
     //check if the user exists
     if(!user) {
        return res.status(404).json({
            success:false,
            message:"User not found",
        })
     }
     //check old the password match
     const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
     if(!isOldPasswordValid) {
        return res.status(401).json({
           success:false,
           message: "Old password is incorrect.",
        });
     }

     //check the new PASS and conf PASS
    if(newPassword !== confrimPassword) {
        return res.status(400).json({
            success:false,
            message: "New password and confirm password do not match.",

        });
    }   

    //Hash the new Password
    const hashedPasswod = await bcrypt.hash(newPassword,100);
    //update pwd in DB
    await User.updateOne({email},{password:hashedPasswod});
    //send mail - Password updated
    await  mailSender(user.email,"Password Update Successful", "Visit the login page to sign in")

    //return response
    return res.status(200).json({
        success:true,
        message:"Password updated successfully. Confirmation email sent.",
    })
     
 } catch(error) {
    console.log(error);
    return res.status(500).josn({
        success:false,
        message:"Password not changed",
    })

 }
}
    



