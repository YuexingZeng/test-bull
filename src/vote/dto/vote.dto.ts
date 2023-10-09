import { IsArray, IsNumber, IsString } from 'class-validator';

export class VoteDto {
  @IsNumber()
  networkId: number;

  @IsString()
  privateKey: string;

  @IsNumber()
  jobId: number;

  @IsNumber()
  proposal: number;

  @IsNumber()
  votee: number;

  @IsArray()
  tokens: Array<number>;
}
