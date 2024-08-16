import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";



export class CreateAuthDto {

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}


export class AuthResponseDto {
  @ApiProperty({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' })
  id: string;

  @ApiProperty({ example: 'email@email.com' })
  email: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2OWMxZWUzLWYzMDUtNGJkNy04M2Q2LWI5NDNjN2I1NzRiZSIsImVtYWlsIjoiZGVkdWFyZG8ubG1AZ21haWwuY29tIiwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3MjA3MDc1NjYsImV4cCI6MTcyMDcxMTE2Nn0' })
  access_token: string;
}