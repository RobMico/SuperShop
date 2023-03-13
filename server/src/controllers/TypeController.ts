import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import CreateTypeDto from "../dto/Type/CreateTypeDto";
import CreateTypePropDto from "../dto/Type/CreateTypePropDto";
import EditTypeDto from "../dto/Type/EditTypeDto";
import ErrorHandlerWrap from "../middleware/errorHandlerWrap";
import TypeService from "../services/TypeService";
import Validator from "../utils/Validator";

class TypeController {
    @ErrorHandlerWrap
    async createType(req: Request, res: Response, next: NextFunction) {
        const typeDto = new CreateTypeDto(req.body);
        if (req.files && req.files.img&&!Array.isArray(req.files.img)) {
            const type = await TypeService.createType(typeDto, req.files.img as UploadedFile);
            return res.json(type);
        }
        else {
            const type = await TypeService.createType(typeDto);
            return res.json(type);
        }

    }
    @ErrorHandlerWrap
    async getAllTypes(req: Request, res: Response, next: NextFunction) {
        const types = await TypeService.getAllTypes();
        return res.json(types);
    }
    @ErrorHandlerWrap
    async editType(req: Request, res: Response, next: NextFunction) {
        const typeDto = new EditTypeDto(req.body);
        if (req.files && req.files.img && !Array.isArray(req.files.img)) {
            const type = await TypeService.editType(typeDto, req.files.img as UploadedFile);
            return res.json(type);
        }
        else{
            const type = await TypeService.editType(typeDto);
            return res.json(type);
        }
    }
    @ErrorHandlerWrap
    async addTypeProp(req: Request, res: Response, next: NextFunction) {
        const typePropDto = new CreateTypePropDto(req.body);
        const result = await TypeService.addTypeProp(typePropDto);
        return res.json(result);
    }
    //TODO:remove type prop
    @ErrorHandlerWrap
    async getTypeProps(req: Request, res: Response, next: NextFunction) {
        const typeId = Validator.ValidatePositiveNumber(req.query.typeId, 'typeId');
        const props = await TypeService.getTypeProps(typeId);
        return res.json(props);
    }
    @ErrorHandlerWrap
    async getCreatePropsSuggestions(req: Request, res: Response, next: NextFunction) {
        const propName = Validator.ValidateBrandTypeName(req.body.propName);
        const result = await TypeService.getSuggestions(propName);
        return res.json(result);
    }

}

export default new TypeController();