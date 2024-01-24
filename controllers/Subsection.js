const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create subsection

exports.createSubsection = async (req,res) => {
    try{
        //fetch data from Req body
        const { SectionId, title, timeDuration, description} = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if(!SectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success:"All fileds are required",
            });
        }
        //upload video to cloudniary 
        const uploadDetalis = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create sub-section
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetalis.secure_url,
        })
        //update sectiom with this subsection
        const updatedSection = await Section.findByIdAndUpdate({_id:SectionId},
                                                               {$push:{
                                                                subSection:subSectionDetails._id,
                                                               }},
                                                               {new:true});
        //TODO log update ssection here, after adding populate query
        //retunr res
        return res.status(200).json({
            success:true,
            message:"Sub Section Created Successfully",
            updatedSection,
        })

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:"unable to create Sub-section, please try again",
            error:error.message,
        })

    }
};

//TODO-update subsection
//TODO-delete subection

