import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Res,
    NotFoundException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { ProductService } from './product.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
  
  @ApiTags('products')
  @ApiBearerAuth()
  @Controller('products')
  @UseGuards(JwtAuthGuard)
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Create a new product with optional image' })
    async create(
      @Body() createProductDto: CreateProductDto,
      @UploadedFile() image?: Express.Multer.File,
    ) {
      return this.productService.create(createProductDto, image);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    async findAll(
      @Query('category') category?: string,
      @Query('minPrice') minPrice?: number,
      @Query('maxPrice') maxPrice?: number,
      @Query('minRating') minRating?: number,
    ) {
      return this.productService.filterProducts(
        category,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined,
        minRating ? Number(minRating) : undefined,
      );
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    async findOne(@Param('id') id: string) {
      return this.productService.findOne(id);
    }
  
    @Get(':id/image')
    @ApiOperation({ summary: 'Get product image' })
    async getImage(@Param('id') id: string, @Res() res: Response) {
      try {
        const imageId = await this.productService.getProductImageId(id);
        const fileInfo = await this.productService.getImageInfo(imageId);
        
        res.set({
          'Content-Type': fileInfo.contentType,
          'Content-Length': fileInfo.length,
          'Cache-Control': 'public, max-age=3600'
        });
    
        const stream = await this.productService.getImageStream(imageId);
        stream.pipe(res);
      } catch (error) {
        throw new NotFoundException('Image not found');
      }
    }
  
    @Put(':id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Update product with optional new image' })
    async update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto,
      @UploadedFile() image?: Express.Multer.File,
    ) {
      return this.productService.update(id, updateProductDto, image);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete product' })
    async remove(@Param('id') id: string) {
      return this.productService.remove(id);
    }
  }