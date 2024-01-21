const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator =  require("otp-generator");



//sendOTP
exports.sendOTp = async (req, res) => {

   try{
    //fetch email from request body
    const {email} = req.body;

    //check if the user already exit
    const checkUserPresent = await User.findOne({email});

    //if user user already exit, then return a response
    if(checkUserPresent) {
        return res.status(401).json({
            success:false,
            message:"user already registered",

        })
    }
    
    //genereate otp
    //line 28 to 48 code bad pratice
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("OTP generated", otp);

    //checkunique otp or not
    let result = await OTP.findOne({otp: otp});

   //result is exit means OTP is already exit then create new otp using while
   //jabtk otp  match hoty to prynt
    while(result) {
        otp = otpGenerator(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        //check entry in db (loop) so its bad pratice (unqiue otp  -->end loop)
        result = await OTP.findOne({otp: otp});
    }

     //unquie otp so create entry for otp in db

    //payload for entry in db 
     const otpPayload = {email, otp};

     //create an entry for  OTP
     const otpBody = await OTP.create(otpPayload);
     console.log(otpBody);

     //return response
     res.stauts(200).json({
        success:true,
        message:"OTP Sent Successfully",
     })

 }  catch(error) {
    console.log();
    return res.status(500).json({
        success:false,
        message:error.message,
    })

   }
   

}


//signUp
exports.singUp =  async (req, res) => {

      //data fetch from requst body 

      const {
          firstName,
          lastName,
          email,
          password,
          confrimPassword,
          accountType,
          contactNumber,
          otp
      } = req.body
      
      //validate data
      if(!firstName || !lastName || !email || !password || !confrimPassword ||
        !otp) {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

       //2 password match (confirm and pass)
       if(password !== confrimPassword) {
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
      const recentOtp = await OTP.find({email}).sort({createAt:-1}).limit(1);
      console.log(recentOtp);

      //validate OTP
      if(recentOtp.length == 0) {
        //OTP not found
        return res.status(400).json({
            success:false,
            message:"OTP not Found",
        })
      } else if(otp !== recentOtp.otp) {
        //invalid OTP
        return res.status(400).json({
            success:false,
            message:"Invalid OTP",
        })
      }

      //Hash Password
      const hashedPasswod = await bcrypt.hash(password, 100);
     
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
        image:sad,
        
     })


     //return res

}



//Login

//changePassword



