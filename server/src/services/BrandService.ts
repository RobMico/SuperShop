import CreateBrandDto from "../dto/CreateBrandDto";
import EditBrandDto from "../dto/EditBrandDto";
import ApiError from "../error/ApiError";
import BrandModel from "../models/BrandModel";
import ImagesManager from "../utils/imagesManager";

class BrandService {
    async editBrand(brandDto: EditBrandDto, img?) {
        const brand = await BrandModel.findByPk(brandDto.brandId);
        if (!brand) {
            throw ApiError.badRequest("Such brand not exists");
        }

        brand.set({
            ...brandDto
        });

        if(img)
        {
            const imageWorker = new ImagesManager('/brands');
            await imageWorker.saveFile(img, brand.img);
        }
        
        await brand.save();
        return brand;

    }
    async getCarousel() {
        const brands = await BrandModel.findAll({ limit: 5, order: [["img", "ASC"]] });
        return brands;
    }
    async getAllBrands() {
        const brands = await BrandModel.findAll();
        return brands;
    }
    async createBrand(brandDto: CreateBrandDto, img?: ImagesManager) {
        const brand = await BrandModel.create({ ...brandDto });
        return brand;
    }

}

export default new BrandService();