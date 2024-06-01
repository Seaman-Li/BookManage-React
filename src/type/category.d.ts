export interface CategoryQueryType {
    name?: string;
    level?: number;
    current?: number;
    pageSize?: number;
    all?: boolean;
  }

export interface CategoryType {
    name: string;
    // 书籍分2个等级
    level: 1 | 2;
    parent: CategoryType;
    _id?: string;
  }