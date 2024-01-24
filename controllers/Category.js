const Category = require("../models/Category");

//create Category  ka handler function

exports.createCategory = async (req, res) => {
    try{
        //fetch data
        const {name, description} = req.body;
        //validation
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:"ALl fields are required",
            })
        }
        //create entry in DB
        const CategoryDetalis = await Category.create({
            name:name,
            description:description,
        });
        console.log(CategoryDetalis);

        //return response
        return res.stauts(200).json({
            success:true,
            message:"Category creeate successfully"
        })


    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
};

//getAll Category
exports.showAllCategorys = async (req,res) => {
    try{
        const allCategorys = await Category.find({}, {name:true,description:true});
        res.status(200).json({
            success:true,
            message:"ALlm Category return successfully",
            allCategorys,
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
};
