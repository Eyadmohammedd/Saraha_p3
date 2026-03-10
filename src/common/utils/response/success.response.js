export const SuccessResponse = ({
    res,
     message = "Done",
     data = undefined } = {}) => {
return res.status(status).json({status,message,data})
}