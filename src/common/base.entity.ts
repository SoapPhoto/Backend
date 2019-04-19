import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {

  @CreateDateColumn()
    public createTime: Date;

  @UpdateDateColumn()
    public updateTime: Date;

}
