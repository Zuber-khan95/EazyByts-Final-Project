import Joi from 'joi'
const eventSchema=Joi.object({
    title:Joi.string().min(3).max(30).required(),
    description:Joi.string().min(10).max(100).required(),
    location:Joi.string().min(3).max(20).required(),
    price:{
       diamond: Joi.number().min(0).required(),
       gold: Joi.number().min(0).required(),
       silver: Joi.number().min(0).required(),
    },
    availableTickets:{
        diamond:Joi.number().min(0).required(),
        gold:Joi.number().min(0).required(),
        silver:Joi.number().min(0).required(),
    },
    category:Joi.string().valid('Music','Sports','Others').required(),  
    status:Joi.string().valid("Scheduled","Ongoing","Completed").required(),
    startDate:Joi.date().required(),
    endDate:Joi.date().required(),
    image:Joi.string().uri().optional(),
    imagePublicId:Joi.string().optional(),
});

const ticketSchema=Joi.object({
    event: Joi.object({ObjectId:Joi.string()}).required(),
    user: Joi.object({ObjectId:Joi.string()}).required(),
ticketType:Joi.valid("diamond","gold","silver").required(),
quantity:Joi.number().required(),
seatNo:Joi.array().items(Joi.number()).required(),
price:Joi.number().min(1).required(),
status:Joi.valid("active","expired","cancelled"),
date:Joi.date().required()

});

export { eventSchema , ticketSchema};

