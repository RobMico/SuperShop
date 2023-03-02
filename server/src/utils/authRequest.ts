import { Request } from "express";
import TokenUserData from "../dto/TokenUserDataDto";

interface AuthRequest extends Request{
    user:TokenUserData
}

export default AuthRequest;