import * as mongoDB from 'mongodb';

export class Conn {
  public static client: mongoDB.MongoClient;
  public static db: mongoDB.Db;

  public static async connect(url: string) {
    this.client = await (new mongoDB.MongoClient(url)).connect();
    this.db = this.client.db('music');
    return this.client;
  }
}