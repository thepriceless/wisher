import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { NewWishitemDto } from '../wishitem/dto/new.wishitem.dto';
import { UserService } from 'src/user/user.service';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { WishitemService } from 'src/wishitem/wishitem.service';
import { PrivacyType } from '@prisma/client';
import { WishlistDto } from './wishlist.dto';
import { WishitemDto } from 'src/wishitem/dto/wishitem.dto';
import { WishitemMapper } from 'src/wishitem/wishitem.mapper';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  wishitemImageExtensionValidation,
  wishitemImageSizeValidation,
} from 'src/s3/image-validators/wishitem.image.validatior';

@ApiTags('Wishlist API')
@Controller('/api')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly wishitemService: WishitemService,
    private readonly userService: UserService,
    private readonly s3service: S3Service,
  ) {}

  @ApiOperation({
    summary: `
    Save new wishitem to wishlist. All required data about wishitem and wishlist, 
    where the wishitem should appear, is encapsulated in newWishitemDto. 
    Image of wishitem is optional.
  `,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Data about new wishitem and the image file. Also contains the wishlist privacy type, where the wishitem should appear',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        newWishitemDto: {
          type: 'object',
          format: 'json',
          description: 'JSON of NewWishitemDto',
        },
        itemImage: {
          type: 'string',
          format: 'binary',
          description: 'Image file of wishitem',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description:
      'Wishitem is successfully saved to wishlist and returned as DTO',
    type: WishitemDto,
  })
  @ApiBearerAuth()
  @Post('/wishitems/new')
  @UseInterceptors(FileInterceptor('imageLink'))
  async saveNewItem(
    @Body() newWishitemDto: NewWishitemDto,
    @UploadedFile(wishitemImageSizeValidation, wishitemImageExtensionValidation)
    itemImage: Express.Multer.File,
    @Headers('authorization') authorization: string,
    @Query('existingimage') existingImage: string,
  ): Promise<WishitemDto> {
    let imageLink = null;
    if (existingImage === 'true') {
      const existingWishitemId = newWishitemDto.existingWishitemId;
      imageLink =
        await this.wishitemService.getWishitemImageLinkByWishitemId(
          existingWishitemId,
        );
    } else if (itemImage !== undefined) {
      imageLink = await this.s3service.uploadImage(
        itemImage,
        process.env.WISHITEM_IMAGE,
      );
    }

    const ownerUser = await this.userService.getUserFromToken(authorization);
    const privacyType =
      PrivacyType[
        newWishitemDto.holderWishlistPrivacy as keyof typeof PrivacyType
      ];

    const wishlist = await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      ownerUser.nickname,
    );

    const newWishitem = WishitemMapper.toEntity(newWishitemDto);
    newWishitem.importance = parseInt(newWishitemDto.importance as any);
    newWishitem.wishlistId = wishlist.id;

    const savedWishitem = await this.wishlistService.saveNewItemToWishlist(
      newWishitem,
      imageLink,
    );

    const savedWishitemDto = WishitemMapper.toDto(savedWishitem);
    savedWishitemDto.wishlistId = wishlist.id;

    return savedWishitemDto;
  }

  @ApiOperation({
    summary: `
    Get wishlist with specified privacy of user with specified nickname
  `,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiQuery({
    name: 'privacy',
    description: 'Privacy type of wishlist',
    type: String,
  })
  @ApiQuery({
    name: 'owner',
    description: 'Nickname of wishlist owner',
    type: String,
  })
  @ApiOkResponse({
    description:
      'Wishlist with specified privacy of user with specified nickname is returned',
    type: WishitemDto,
  })
  @ApiNotFoundResponse({
    description:
      'Wishlist with specified privacy of user with specified nickname is not found',
  })
  @ApiBearerAuth()
  @Get('/wishlists')
  async findWishlistByPrivacyAndOwner(
    @Headers('authorization') authorization: string,
    @Query('privacy') privacy: string,
    @Query('owner') owner: string,
  ): Promise<WishlistDto> {
    let ownerNickname: string;
    if (owner) {
      ownerNickname = owner;
    } else {
      const ownerUser = await this.userService.getUserFromToken(authorization);
      ownerNickname = ownerUser.nickname;
    }

    const privacyType = PrivacyType[privacy as keyof typeof PrivacyType];

    return await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      ownerNickname,
    );
  }

  @ApiOperation({
    summary: `
    Create a link between existing wishitem and wishlist.
    After this operation, wishlist will contain the wishitem.
  `,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiParam({
    name: 'id',
    description: 'Id of existing wishitem',
    type: String,
  })
  @ApiQuery({
    name: 'privacy',
    description: 'Privacy type of wishlist',
    type: String,
  })
  @ApiCreatedResponse({
    description:
      'Wishitem is successfully connected to wishlist and returned as DTO',
    type: WishitemDto,
  })
  @ApiNotFoundResponse({
    description:
      'Wishitem with specified id is not found or wishlist with specified privacy is not found',
  })
  @ApiBearerAuth()
  @Post('wishitems/:id')
  async connectExistingWishitemToWishlist(
    @Param('id') wishitemId: string,
    @Query('privacy') wishlistPrivacy: string,
    @Headers('authorization') authorization: string,
  ): Promise<WishitemDto> {
    const user = await this.userService.getUserFromToken(authorization);
    const privacyType =
      PrivacyType[wishlistPrivacy as keyof typeof PrivacyType];

    const wishlist = await this.wishlistService.findWishlistByPrivacyAndOwner(
      privacyType,
      user.nickname,
    );

    const connectedItem =
      await this.wishitemService.connectExistingWishitemToWishlist(
        wishitemId,
        wishlist.id,
      );

    const dto = WishitemMapper.toDto(connectedItem);

    return dto;
  }

  @ApiOperation({
    summary: `
    Delete a link between existing wishitem and wishlist.
    After this operation, wishlist will not contain the wishitem.
  `,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'JWT authorization token',
  })
  @ApiQuery({
    name: 'wishitem',
    description: 'Id of existing wishitem',
    type: String,
  })
  @ApiQuery({
    name: 'wishlist',
    description: 'Id of wishlist, where the wishitem is connected to',
    type: String,
  })
  @ApiOkResponse({
    description:
      'Wishitem is successfully disconnected from wishlist and returned as DTO',
    type: WishitemDto,
  })
  @ApiNotFoundResponse({
    description:
      'Wishitem with specified id is not found or wishlist with specified id is not found',
  })
  @ApiBearerAuth()
  @Delete('/wishitems')
  async deleteItemFromWishlist(
    @Headers('authorization') authorization: string,
    @Query('wishitem') wishitemId: string,
    @Query('wishlist') wishlistId: string,
  ): Promise<WishitemDto> {
    const ownerUser = await this.userService.getUserFromToken(authorization);
    const ownedWishlists =
      await this.wishlistService.getWishlistsByOwner(ownerUser);

    const isOwner = ownedWishlists.some(
      (wishlist) => wishlist.id === wishlistId,
    );

    if (!isOwner) {
      throw new ForbiddenException('Not your wishlist');
    }

    const disconnectedItem =
      await this.wishitemService.disconnectExistingWishitemFromWishlist(
        wishitemId,
        wishlistId,
      );

    const dto = WishitemMapper.toDto(disconnectedItem);

    return dto;
  }
}
