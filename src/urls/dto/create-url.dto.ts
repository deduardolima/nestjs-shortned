import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUrl } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";


export class CreateUrlDto {

  @ApiProperty({ example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/' })
  @IsUrl()
  originalUrl: string;
}


export class UrlWithOwnerResponseDto {
  @ApiProperty({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' })
  id: string;

  @ApiProperty({ example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/' })
  originalUrl: string;
  @ApiProperty({ example: 'https://localhost:3000/D5a1Fr' })
  shortUrl: string;

  @IsOptional()
  @ApiProperty({ type: CreateUserDto })
  owner: CreateUserDto

}

export class UrlResponseDto {
  @ApiProperty({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' })
  id: string;

  @ApiProperty({ example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/' })
  originalUrl: string;

  @ApiProperty({ example: 'KTCeYd' })
  shortUrl: string;

  @ApiProperty({ example: 5 })
  clicks: number

  @ApiProperty({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' })
  ownerId: string

  @ApiProperty({ example: '12024-08-16T19:04:38.256Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-08-16T19:08:01.445Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'null' })
  deletedAt: Date | null

}