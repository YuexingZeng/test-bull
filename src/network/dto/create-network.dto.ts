import { IsNumber, IsString } from 'class-validator';

export class CreateNetworkDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  url: string;
}
