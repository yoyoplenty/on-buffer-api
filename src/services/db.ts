import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async transaction<T>(callback: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const result = await callback(session);

      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
