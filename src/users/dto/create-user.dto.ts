import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreateUserDto {

  @ApiProperty({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' })
  id: string;

  @ApiProperty({ example: 'email@email.com' })
  @IsEmail()
  email: string;
}




export class UserResponseDto {

  @ApiProperty({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;


}
