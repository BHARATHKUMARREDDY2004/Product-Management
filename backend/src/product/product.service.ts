import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GridFsService } from '../gridfs/gridfs.service';
import { Readable } from 'stream';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly gridFsService: GridFsService,
  ) {}

  async create(createProductDto: CreateProductDto, image?: Express.Multer.File): Promise<Product> {
    let imageId: string | undefined;
    
    if (image) {
      const { fileId } = await this.gridFsService.uploadFile(image);
      imageId = fileId.toString();
    }

    const createdProduct = new this.productModel({
      ...createProductDto,
      imageId,
    });
    
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: id, isActive: true }).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    image?: Express.Multer.File,
  ): Promise<Product> {
    let imageId: string | undefined;
    
    if (image) {
      const { fileId } = await this.gridFsService.uploadFile(image);
      imageId = fileId.toString();
      
      const existingProduct = await this.productModel.findById(id).exec();
      if (existingProduct?.imageId) {
        await this.gridFsService.deleteFile(existingProduct.imageId);
      }
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        { ...updateProductDto, ...(imageId && { imageId }) },
        { new: true },
      )
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.imageId) {
      await this.gridFsService.deleteFile(product.imageId);
    }
    
    product.isActive = false;
    return product.save();
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productModel
      .find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }

  async filterProducts(
    category?: string, 
    minPrice?: number, 
    maxPrice?: number, 
    minRating?: number
  ): Promise<Product[]> {
    const filter: any = { isActive: true };
    
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (minRating) filter.rating = { $gte: minRating };

    return this.productModel.find(filter).exec();
  }

  async getProductImageId(productId: string): Promise<string> {
    const product = await this.findOne(productId);
    if (!product.imageId) {
      throw new NotFoundException('Product image not found');
    }
    return product.imageId;
  }
  
  async getImageStream(imageId: string): Promise<Readable> {
    return this.gridFsService.getFileStream(imageId);
  }

  async getImageInfo(imageId: string): Promise<{ 
    contentType: string; 
    length: number 
  }> {
    return this.gridFsService.getFileInfo(imageId);
  }
}