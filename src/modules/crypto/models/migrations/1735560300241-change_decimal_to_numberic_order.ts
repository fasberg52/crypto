import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeDecimalToNumbericOrder1735560300241
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'market.orders',
      'price',
      new TableColumn({
        name: 'price',
        type: 'numeric',
        precision: 10,
        scale: 3,
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'market.orders',
      'amount',
      new TableColumn({
        name: 'amount',
        type: 'numeric',
        precision: 10,
        scale: 3,
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'market.orders',
      'total',
      new TableColumn({
        name: 'total',
        type: 'numeric',
        precision: 65,
        scale: 20,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('market.orders', 'price');
    await queryRunner.dropColumn('market.orders', 'total');
    await queryRunner.dropColumn('market.orders', 'amount');
  }
}
