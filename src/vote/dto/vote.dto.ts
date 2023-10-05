import { IsArray, IsNumber } from 'class-validator';

export class VoteDto {
  @IsNumber()
  proposal: number;
  @IsNumber()
  votee: number;
  @IsArray()
  tokens: Array<number>;
}
