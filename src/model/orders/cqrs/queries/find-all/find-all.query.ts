import { PaginationDto } from 'src/common/common.dto';

export class FindAllOrderCommand {
  constructor(public readonly pagination: PaginationDto) {}
}
