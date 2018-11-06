import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
@Entity('soap')
export class Post {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public title: string;

  @Column()
  public text: string;

}
