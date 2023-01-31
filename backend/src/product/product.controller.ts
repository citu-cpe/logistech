import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CompanyTypeEnum } from '../company/dto/company.dto';
import { CreateManyProductItemsDTO } from './dto/create-many-product-items.dto';
import { CreateProductItemDTO } from './dto/create-product-item.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductItemDTO } from './dto/product-item.dto';
import { ProductDTO } from './dto/product.dto';
import { ProductItemService } from './product-item.service';
import { ProductService } from './product.service';

@Controller(ProductController.PRODUCT_API_ROUTE)
export class ProductController {
  public static readonly PRODUCT_API_ROUTE = '/product';
  public static readonly COMMERCE_API_ROUTE = '/product/commerce';
  public static readonly ID_API_ROUTE = '/:id';
  public static readonly COMPANY_API_ROUTE = '/company/:companyId';
  public static readonly PRODUCT_ITEM_API_ROUTE = '/:productId/product-item';
  public static readonly CREATE_MANY_PRODUCT_ITEMS_API_ROUTE =
    '/:productId/product-item/many';

  constructor(
    private readonly productService: ProductService,
    private readonly productItemService: ProductItemService
  ) {}

  @Get(ProductController.COMPANY_API_ROUTE)
  public getProductsForCompany(
    @Param('companyId') companyId: string
  ): Promise<ProductDTO[]> {
    return this.productService.getProductsForCompany(companyId);
  }

  @Get(ProductController.COMMERCE_API_ROUTE)
  public getCommerceProducts(
    @Param('companyType') companyType: CompanyTypeEnum
  ): Promise<ProductDTO[]> {
    return this.productService.getCommerceProducts(companyType);
  }

  @Post(ProductController.COMPANY_API_ROUTE)
  public createProduct(
    @Body() dto: CreateProductDTO,
    @Param('companyId') companyId: string
  ) {
    return this.productService.createProduct(dto, companyId);
  }

  @Put(ProductController.ID_API_ROUTE)
  public editProduct(@Body() dto: CreateProductDTO, @Param('id') id: string) {
    return this.productService.editProduct(dto, id);
  }

  @Delete(ProductController.ID_API_ROUTE)
  public deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Get(ProductController.PRODUCT_ITEM_API_ROUTE)
  public getProductItems(
    @Param('productId') productId: string
  ): Promise<ProductItemDTO[]> {
    return this.productItemService.getProductItemsByProductId(productId);
  }

  @Post(ProductController.PRODUCT_ITEM_API_ROUTE)
  public createProductItem(
    @Body() dto: CreateProductItemDTO,
    @Param('productId') productId: string
  ) {
    return this.productItemService.createProductItem(dto, productId);
  }

  @Post(ProductController.CREATE_MANY_PRODUCT_ITEMS_API_ROUTE)
  public createManyProductItems(
    @Body() dto: CreateManyProductItemsDTO,
    @Param('productId') productId: string
  ) {
    return this.productItemService.createManyProductItems(
      dto.productItems,
      productId
    );
  }

  @Put(
    ProductController.PRODUCT_ITEM_API_ROUTE + ProductController.ID_API_ROUTE
  )
  public editProductItem(
    @Body() dto: CreateProductItemDTO,
    @Param('productId') _productId: string,
    @Param('id') id: string
  ) {
    return this.productItemService.editProductItem(dto, id);
  }

  @Delete(
    ProductController.PRODUCT_ITEM_API_ROUTE + ProductController.ID_API_ROUTE
  )
  public deleteProductItem(
    @Param('productId') _productId: string,
    @Param('id') id: string
  ) {
    return this.productItemService.deleteProductItem(id);
  }
}
