import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsIn,
} from 'class-validator';

export class CalculateDto {
  @IsNotEmpty()
  @IsNumber()
  a: number;

  @IsNotEmpty()
  @IsNumber()
  b: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['add', 'subtract', 'multiply', 'divide'])
  operator: string;
}