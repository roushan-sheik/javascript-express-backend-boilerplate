const successResponse = ({res, code = 200, success = true, message = "", data = null}) => {
    return res.status(code).json({
        success,
        message,
        code,
        data,
    });
};

export default successResponse;