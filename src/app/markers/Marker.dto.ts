import { Exclude, Expose, Transform } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  Length,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsUrl,
} from "class-validator";
import { transformCoordinates } from "utils/transform-coordinates";

export class CreateMarkerDto {
  @Expose()
  @IsString()
  @Length(2, 100)
  title!: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @Transform(transformCoordinates)
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates!: [number, number];

  @Exclude()
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;
}

export class UpdateMarkerDto {
  @Expose()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @Transform(transformCoordinates)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates!: [number, number];

  @Exclude()
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;
}
