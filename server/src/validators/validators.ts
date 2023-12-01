import Joi from "joi";



// user registration validators
export const regUserValidation = Joi.object({
    fullName: Joi.string().required().min(3).max(30),
    email : Joi.string().required().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ke']
        }
    }),
    password: Joi.string().required().pattern(
        new RegExp('^[a-zA-Z0-9!@#$%^&*()]{3,30}$')
    ),
    profileImage: Joi.string().required()
})


// user login validators
export const loginUserValidation=Joi.object({
    email: Joi.string().required().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ke']
        }
    }),
    password: Joi.string().required().pattern(
        new RegExp('^[a-zA-Z0-9!@#$%^&*()]{3,30}$')
    )

})

// update user validators

export const validateUpdateuser=Joi.object({
    fullName: Joi.string().required().min(3).max(30),
    email : Joi.string().required().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ke']
        }
    }),
    profileImage: Joi.string().required()
})

