export interface TableHeadsModel {
    header: string,
    key: string,
    isActive: boolean
}

export interface TableDataModel {
    [key: string]: string | number | Date
    
}

export type Keys = 'firstName' | 'lastName' ;