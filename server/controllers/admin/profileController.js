const User = require("../../models/user/user");


// GET ADMIN PROFILE
const getAdminProfile = async (req, res) => {

  try {

   console.log("req.userId:", req.userId);

const admin = await User.findById(req.userId).select("-password");

// console.log("Admin Data:", admin);

    if (!admin || admin.role !== "admin") {

      return res.status(404).json({
        message: "Admin not found"
      });

    }


    res.status(200).json(admin);


  } catch(error) {

    res.status(500).json({
      message:error.message
    });

  }

};



const updateAdminProfile = async(req,res)=>{

 try{

   const admin = await User.findById(req.userId);


   if(!admin || admin.role !== "admin"){

      return res.status(404).json({
        message:"Admin not found"
      });

   }


   admin.name = req.body.name || admin.name;
   admin.email = req.body.email || admin.email;


   await admin.save();


   res.json({
     message:"Profile Updated",
     admin
   });


 }catch(error){

   res.status(500).json({
     message:error.message
   });

 }

};



module.exports={
 getAdminProfile,
 updateAdminProfile
};