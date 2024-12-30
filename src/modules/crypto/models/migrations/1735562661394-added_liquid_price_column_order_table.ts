import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddedLiquidPriceColumnOrderTable1735562661394
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'market.orders',
      new TableColumn({
        name: 'liquidPrice',
        type: 'numeric',
        precision: 10,
        scale: 3,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('market.orders', 'liquidPrice');
  }
}
