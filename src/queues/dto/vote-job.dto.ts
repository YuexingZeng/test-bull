import { IsNumber } from 'class-validator';

export class VoteJobDto {
  @IsNumber()
  current: number;

  @IsNumber()
  target: number;

  @IsNumber()
  proposalId: number;

  @IsNumber()
  votee: number;
}
