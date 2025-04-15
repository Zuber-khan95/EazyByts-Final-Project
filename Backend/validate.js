import Joi from 'joi'
const eventSchema=Joi.object({
    title:Joi.string().min(3).max(30).required(),
    description:Joi.string().min(10).max(50).required(),
    location:Joi.string().min(3).max(20).required(),
    price:Joi.number().min(0).required(),
    availableTickets:Joi.number().min(0).required(),
    category:Joi.string().valid('Music','Sports','Others').required(),  
    status:Joi.string().valid("Scheduled","Ongoing","Completed").required(),
    startDate:Joi.date().required(),
    endDate:Joi.date().required(),
    // image:Joi.object({
    //     url:Joi.string(),
    //     filename:Joi.string(),
    // }),
});

export { eventSchema };

