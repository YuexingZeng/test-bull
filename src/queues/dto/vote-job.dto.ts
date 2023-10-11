import { IsArray, IsNumber, IsString } from 'class-validator';

export class VoteJobDto {
  @IsNumber()
  networkId: number;

  @IsString()
  voteContractAddress: string;

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
