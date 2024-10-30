import * as mongoDB from 'mongodb';

export class MongoHelper {
  public static client: mongoDB.MongoClient;

  public static connect(url: string): Promise<mongoDB.MongoClient> {
    this.client = new mongoDB.MongoClient(url);
    return this.client.connect()
  }
}