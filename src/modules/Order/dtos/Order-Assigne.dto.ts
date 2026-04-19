import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignCaptainDto {
  @IsMongoId()
  @IsNotEmpty()
  captainId: string;
}