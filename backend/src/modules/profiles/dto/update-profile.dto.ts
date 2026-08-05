import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNumber, Min, Max, IsOptional, IsEnum, ValidateNested, 
  IsString, IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../enums/gender.enum';

export class CoordinatesDto {
  @ApiProperty() @IsNumber() lat: number;
  @ApiProperty() @IsNumber() lng: number;
}

export class LocationDto {
  @ApiProperty() @IsString() city: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() state?: string;
  @ApiProperty() @IsString() country: string;
  @ApiProperty({ required: false }) @ValidateNested() @Type(() => CoordinatesDto) @IsOptional() coordinates?: CoordinatesDto;
}

export class PersonalityDto {
  @ApiProperty() @IsNumber() openness: number;
  @ApiProperty() @IsNumber() conscientiousness: number;
  @ApiProperty() @IsNumber() extraversion: number;
  @ApiProperty() @IsNumber() agreeableness: number;
  @ApiProperty() @IsNumber() neuroticism: number;
}

export class GoalsDto {
  @ApiProperty() @IsString() relationship: string;
  @ApiProperty() @IsArray() @IsString({ each: true }) personal: string[];
  @ApiProperty({ required: false }) @IsString() @IsOptional() timeline?: string;
}

export class AgeRangeDto {
  @ApiProperty() @IsNumber() min: number;
  @ApiProperty() @IsNumber() max: number;
}

export class PreferencesDto {
  @ApiProperty() @ValidateNested() @Type(() => AgeRangeDto) ageRange: AgeRangeDto;
  @ApiProperty({ enum: Gender, isArray: true }) @IsArray() @IsEnum(Gender, { each: true }) genderPreference: Gender[];
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() maxDistance?: number;
  @ApiProperty() @IsArray() @IsString({ each: true }) dealBreakers: string[];
}

export class LifestyleDto {
  @ApiProperty() @IsString() schedule: string;
  @ApiProperty() @IsString() socialLevel: string;
  @ApiProperty() @IsString() exercise: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() diet?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() smoking?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() drinking?: string;
}

export class ProfessionDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() industry?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() company?: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @Min(18)
  @Max(120)
  @IsOptional()
  age?: number;

  @ApiProperty({ required: false, enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ required: false, type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({ required: false, type: PersonalityDto })
  @ValidateNested()
  @Type(() => PersonalityDto)
  @IsOptional()
  personality?: PersonalityDto;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  values?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  communicationStyle?: string;

  @ApiProperty({ required: false, type: GoalsDto })
  @ValidateNested()
  @Type(() => GoalsDto)
  @IsOptional()
  goals?: GoalsDto;

  @ApiProperty({ required: false, type: PreferencesDto })
  @ValidateNested()
  @Type(() => PreferencesDto)
  @IsOptional()
  preferences?: PreferencesDto;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dealBreakers?: string[];

  @ApiProperty({ required: false, type: LifestyleDto })
  @ValidateNested()
  @Type(() => LifestyleDto)
  @IsOptional()
  lifestyle?: LifestyleDto;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiProperty({ required: false, type: ProfessionDto })
  @ValidateNested()
  @Type(() => ProfessionDto)
  @IsOptional()
  profession?: ProfessionDto;
}
