import { Status } from './status.entity';

export class Order {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  userId?: string;
  status?: Status;
}
