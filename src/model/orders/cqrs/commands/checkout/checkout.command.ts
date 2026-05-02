import { CheckOutDto } from 'src/model/orders/dto/checkout.dto';

export class CheckOutCommand {
  constructor(public readonly payload: CheckOutDto) {}
}
