import { Response, NextFunction, Request } from "express";
import { UploadedFile } from "express-fileupload";
import CreateBrandDto from "../dto/Brand/CreateBrandDto";
import EditBrandDto from "../dto/Brand/EditBrandDto";
import ErrorHandlerWrap from "../middleware/errorHandlerWrap";
import BrandService from "../services/BrandService";
import AuthRequest from "../utils/authRequest";
import ImagesManager from "../utils/imagesManager";

class BrandController {
    @ErrorHandlerWrap
    async createBrand(req: AuthRequest, res: Response, next: NextFunction) {
        const brandDto = new CreateBrandDto(req.body);
        let img: ImagesManager;

        if (req.files && req.files.img && !Array.isArray(req.files.img)) {
            img = new ImagesManager('brands/');
            brandDto.img = await img.saveFile(req.files.img as UploadedFile);
        }

        try {
            const brand = await BrandService.createBrand(brandDto);
            return res.json(brand);
        } catch (ex) {
            if (img) {
                await img.revert();
            }
            throw ex;
        }
    }

    @ErrorHandlerWrap
    async getAllBrands(req: Request, res: Response, next: NextFunction) {
        const brands = await BrandService.getAllBrands();
        return res.json(brands);
    }

    @ErrorHandlerWrap
    async getImagesCarousel(req: Request, res: Response, next: NextFunction) {
        const brands = await BrandService.getCarousel();
        return res.json(brands);
    }

    @ErrorHandlerWrap
    async editBrandData(req: Request, res: Response, next: NextFunction) {
        const brandDto = new EditBrandDto(req.body);
        if (req.files && req.files.img && !Array.isArray(req.files.img)) {
            const brand = await BrandService.editBrand(brandDto, req.files.img as UploadedFile);
            return res.json(brand);
        }

        const brand = await BrandService.editBrand(brandDto);
        return res.json(brand);
    }
}


export default new BrandController();