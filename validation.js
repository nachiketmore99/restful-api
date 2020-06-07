const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        // token: Joi.string().token()
    });

    return schema.validate(data);
}


const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    return schema.validate(data);
}


const projectValidation = (data) => {
    const schema = Joi.object({
        project_name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().required()
    });

    return schema.validate(data);
}

const sessionValidation = (data) => {
    const schema = Joi.object({
        session_name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().required()
    });

    return schema.validate(data);
}

const memberValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        session_id: Joi.string().required()
    });

    return schema.validate(data);
}

const codeValidation = (data) => {
    const schema = Joi.object({
        project_name: Joi.string().required(),
        code: Joi.string(),
        username: Joi.string().required(),
        email: Joi.string().required()
    });

    return schema.validate(data);
}

const deleteValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        name: Joi.string().required(),
        isSession: Joi.boolean()
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.projectValidation = projectValidation;
module.exports.sessionValidation = sessionValidation;
module.exports.memberValidation = memberValidation;
module.exports.codeValidation = codeValidation;
module.exports.deleteValidation = deleteValidation;