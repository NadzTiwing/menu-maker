export interface IFirebaseConfig {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
}

export interface ICategory {
  id: string,
  name: string;
}

export interface IAmount {
  cost: number,
  stock: number,
}

export interface IItemOption extends IAmount {
  id: string,
  name: string,
}

export interface IItem extends IAmount {
  id: string,
  name: string,
  category: ICategory
}

export interface IItemWithOptions extends IItem {
  options: IItemOption[]
}

export interface IPopupMessage {
  isOpen: boolean,
  handleShow: () => void,
  message: string
}

export interface IEditModal {
  isOpen: boolean,
  handleShow: () => void,
  details: IItem | IItemWithOptions | null
}

export interface ICategoriesSelection {
  category: ICategory | null,
  handleSelect: ( newValue: ICategory) => void
}

export interface IItemProps extends IItemOption {
  index: number,
  handleChange: (id: string, type: string, value: string | number) => void;
  handleRemove: (id: string) => void;
}