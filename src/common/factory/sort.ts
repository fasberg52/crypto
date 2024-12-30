import { FindManyOptions, FindOptionsOrder } from "typeorm";

export function applySortingToFindOptions<T>(
  options: FindManyOptions<T>,
  sort: string | undefined,
  sortOrder: string | undefined,
  defaultSortField: string = 'id',
  defaultSortOrder: 'ASC' | 'DESC' = 'DESC',
): FindManyOptions<T> {
  const order = sortOrder && sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const sortField = sort ? sort : defaultSortField;

  options.order = {
    [sortField]: order || defaultSortOrder,
  } as FindOptionsOrder<T>;

  return options;
}
