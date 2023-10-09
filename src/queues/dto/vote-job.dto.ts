import { IsArray, IsNumber } from 'class-validator';

export class VoteJobDto {
  @IsNumber()
  networkId: number;

  @IsNumber()
  current: number;

  @IsArray()
  privateKeys: Array<string>;

  @IsNumber()
  target: number;

  @IsNumber()
  proposalId: number;

  @IsNumber()
  votee: number;
}
