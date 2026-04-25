import Database from "../config/database.js";

export default class BaseController {
    protected db = Database.getInstance().getconnection();

    protected sendSuccess(res: any, data: any, message: string = "Success") {
        return res.status(200).json({
            success: true,
            message,
            data,
        });
    }
}
