import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  earned: number;

  @Prop({ required: true })
  spent: number;

  @Prop({ required: true })
  payout: number;

  @Prop({ required: true })
  paidOut: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
