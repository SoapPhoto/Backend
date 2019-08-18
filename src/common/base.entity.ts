import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

export abstract class BaseEntity {
  @CreateDateColumn()
  @Expose()
  public createTime!: Date;

  @UpdateDateColumn()
  @Expose()
  public updateTime!: Date;
}
