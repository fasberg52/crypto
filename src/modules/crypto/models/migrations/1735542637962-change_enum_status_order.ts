import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { OrderStatusEnum } from '../../enums/order.enum';

export class ChangeEnumStatusOrder1735542637962 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'market.orders',
      'status',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: Object.values(OrderStatusEnum),
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('market.orders', 'status');
  }
}
