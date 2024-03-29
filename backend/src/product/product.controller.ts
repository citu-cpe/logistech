import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { AssignCourierToProductItemDTO } from './dto/assign-courier-to-product-item.dto';
import { AssignRfidToProductItemDTO } from './dto/assign-rfid-to-product-item.dto';
import { CommerceProductDTO } from './dto/commerce-product.dto';
import { CourierIdDTO } from './dto/courier-id.dto';
import { CourierProductItemsDTO } from './dto/courier-product-items.dto';
import { CreateManyProductItemsDTO } from './dto/create-many-product-items.dto';
import { CreateProductItemDTO } from './dto/create-product-item.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductItemByStatusDTO } from './dto/product-item-by-status.dto';
import { ProductItemStatusQuantityDTO } from './dto/product-item-status-quantity.dto';
import { ProductItemDTO } from './dto/product-item.dto';
import { ProductDTO } from './dto/product.dto';
import { UpdateProductItemStatusDTO } from './dto/update-product-item-status.dto';
import { ProductItemService } from './product-item.service';
import { ProductService } from './product.service';

@Controller(ProductController.PRODUCT_API_ROUTE)
export class ProductController {
  public static readonly PRODUCT_API_ROUTE = '/product';
  public static readonly COMMERCE_API_ROUTE = '/:companyId/commerce';
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

  @Get(ProductController.COMPANY_API_ROUTE + '/top-ten')
  public getTopTenProducts(
    @Param('companyId') companyId: string
  ): Promise<ProductDTO[]> {
    return this.productService.getTopTenProducts(companyId);
  }

  @Post(ProductController.COMMERCE_API_ROUTE)
  @HttpCode(HttpStatus.OK)
  public getCommerceProducts(
    @Param('companyId') companyId: string,
    @Body() dto: CommerceProductDTO
  ): Promise<ProductDTO[]> {
    return this.productService.getCommerceProducts(dto.companyTypes, companyId);
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

  @Get('/product-items/company/:companyId')
  public getProductItemsByCompany(
    @Param('companyId') companyId: string
  ): Promise<ProductItemDTO[]> {
    return this.productItemService.getProductItemsByCompanyId(companyId);
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

  @Put('/product-item/:productItemId')
  public editProductItem(
    @Body() dto: CreateProductItemDTO,
    @Param('productItemId') id: string
  ) {
    return this.productItemService.editProductItem(dto, id);
  }

  @Delete('/product-item/:productItemId')
  public deleteProductItem(@Param('productItemId') id: string) {
    return this.productItemService.deleteProductItem(id);
  }

  @Post(ProductController.COMPANY_API_ROUTE + '/status')
  public getProductItemsByStatus(
    @Param('companyId') companyId: string,
    @Body() dto: ProductItemByStatusDTO
  ): Promise<ProductItemDTO[]> {
    return this.productItemService.getProductItemsByStatus(
      dto.status,
      companyId
    );
  }

  @Post(ProductController.COMPANY_API_ROUTE + '/status/ordered')
  public getOrderedProductItemsByStatus(
    @Param('companyId') companyId: string,
    @Body() dto: ProductItemByStatusDTO
  ): Promise<ProductItemDTO[]> {
    return this.productItemService.getOrderedProductItemsByStatus(
      dto.status,
      companyId
    );
  }

  @Post('/product-item/status/user')
  public getProductItemsByStatusAndUser(
    @Req() { user }: RequestWithUser,
    @Body() dto: ProductItemByStatusDTO
  ): Promise<ProductItemDTO[]> {
    return this.productItemService.getProductItemsByStatusAndUser(
      dto.status,
      user.id
    );
  }

  @Post('/company/:companyId/product-item/status/quantity')
  public getProductItemStatusQuantity(
    @Param('companyId') companyId: string,
    @Body() dto: CourierIdDTO
  ): Promise<ProductItemStatusQuantityDTO> {
    return this.productItemService.getProductItemStatusQuantity(companyId, dto);
  }

  @Post('/product-item/:productItemId')
  public returnProductItem(
    @Req() { user }: RequestWithUser,
    @Param('productItemId') productItemId: string
  ) {
    return this.productItemService.returnProductItem(productItemId, user.id);
  }

  @Get('/product-item/courier')
  public getCourierAssignedProductItems(
    @Req() { user }: RequestWithUser
  ): Promise<CourierProductItemsDTO> {
    return this.productItemService.getCourierAssignedProductItems(user.id);
  }

  @Patch('/product-item/:productItemId/status')
  public updateProductItemStatus(
    @Param('productItemId') productItemId: string,
    @Body() dto: UpdateProductItemStatusDTO
  ) {
    return this.productItemService.updateProductItemStatus(productItemId, dto);
  }

  @Patch('/product-item/:productItemId/courier')
  public assignCourierToProductItem(
    @Param('productItemId') productItemId: string,
    @Body() dto: AssignCourierToProductItemDTO
  ) {
    return this.productItemService.assignCourierToProductItem(
      productItemId,
      dto.courierId
    );
  }

  @Get('/product-item/returned')
  public getReturnedProductItems(
    @Req() { user }: RequestWithUser
  ): Promise<ProductItemDTO[]> {
    return this.productItemService.getReturnedProductItems(user.id);
  }

  @Patch('/product-item/:productItemId/rfid')
  public assignRfidToProductItem(
    @Param('productItemId') productItemId: string,
    @Body() dto: AssignRfidToProductItemDTO
  ) {
    return this.productItemService.assignRfidToProductItem(
      productItemId,
      dto.rfid
    );
  }
}
