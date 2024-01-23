const Tag = require("../models/tags");

//create tag  ka handler function

exports.createTag = async (req, res) => {
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
        const tagDetalis = await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDetalis);

        //return response
        return res.stauts(200).json({
            success:true,
            message:"Tag creeate successfully"
        })


    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
};

//getAll tag
exports.showAlltags = async (req,res) => {
    try{
        const allTags = await Tag.find({}, {name:true,description:true});
        res.status(200).json({
            success:true,
            message:"ALlm tag return successfully",
            allTags,
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
};
