export interface ICategory {
  id: string,
  name: string;
}

export interface IAmount {
  cost: number,
  stock: number,
}

export interface IItemOptions extends IAmount {
  id: string,
  name: string,
}
