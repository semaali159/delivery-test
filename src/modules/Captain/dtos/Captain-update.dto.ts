import { PartialType } from '@nestjs/mapped-types';
import { CreateCaptainDto } from './Captain-Create.dto';

export class UpdateCaptainDto extends PartialType(CreateCaptainDto) {}