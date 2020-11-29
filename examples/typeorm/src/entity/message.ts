import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  author!: string;

  @Column('text')
  text!: string;
}

export type MessageInput = Omit<Message, 'id'>;
